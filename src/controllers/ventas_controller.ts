import { Request, Response } from "express";
import { Venta } from "../models/Venta";
import { Producto } from "../models/Producto";
import { MovimientoInventario } from "../models/MovimientoInventario";
import { AppError } from "../errors/AppError";
import mongoose from "mongoose";
import { emitRealtime } from "../services/realtime";
import { notifyStockIfNeeded } from "../services/stockNotifications";

interface VentaInput {
  producto: string;
  cantidad: number;
}

export async function getAllVentas(_req: Request, res: Response) {
  res.json(
    await Venta.find()
      .populate("productos.producto")
      .populate("registradaPor", "nombre email rol")
      .sort({ createdAt: -1 }),
  );
}
export async function getVentaById(req: Request, res: Response) {
  const item = await Venta.findById(req.params.id).populate(
    "productos.producto",
  );
  if (!item) throw new AppError("Venta no encontrada", 404);
  res.json(item);
}
export async function createVenta(req: Request, res: Response) {
  const items = req.body.productos as VentaInput[];
  if (!Array.isArray(items) || items.length === 0)
    throw new AppError("La venta requiere al menos un producto", 400);
  if (new Set(items.map((item) => item.producto)).size !== items.length)
    throw new AppError(
      "No se puede repetir un producto en la misma venta",
      400,
    );

  const session = await mongoose.startSession();
  let venta: InstanceType<typeof Venta> | undefined;
  try {
    await session.withTransaction(async () => {
      const detalles: Array<{
        producto: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
      }> = [];
      for (const item of items) {
        if (
          !item.producto ||
          !Number.isInteger(item.cantidad) ||
          item.cantidad <= 0
        )
          throw new AppError(
            "Cada producto requiere identificador y cantidad entera positiva",
            400,
          );
        const producto = await Producto.findById(item.producto).session(
          session,
        );
        if (!producto)
          throw new AppError(`Producto no encontrado: ${item.producto}`, 404);
        if (producto.stock < item.cantidad)
          throw new AppError(`Stock insuficiente para ${producto.nombre}`, 409);
        const anterior = producto.stock;
        producto.stock -= item.cantidad;
        await producto.save({ session });
        detalles.push({
          producto: producto.id,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * item.cantidad,
        });
        await MovimientoInventario.create(
          [
            {
              producto: producto.id,
              tipo: "salida",
              cantidad: item.cantidad,
              motivo: "Venta",
              stockAnterior: anterior,
              stockNuevo: producto.stock,
              registradoPor: req.user?.id,
            },
          ],
          { session },
        );
      }
      [venta] = await Venta.create(
        [
          {
            productos: detalles,
            total: detalles.reduce((total, item) => total + item.subtotal, 0),
            registradaPor: req.user?.id,
          },
        ],
        { session },
      );
    });
  } finally {
    await session.endSession();
  }
  if (!venta) throw new AppError("No fue posible registrar la venta", 500);
  emitRealtime("venta:registrada", venta);
  for (const item of items) void notifyStockIfNeeded(item.producto);
  res.status(201).json(venta);
}
