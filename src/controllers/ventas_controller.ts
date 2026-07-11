import { Request, Response } from "express";
import { Venta } from "../models/Venta";
import { Producto } from "../models/Producto";
import { MovimientoInventario } from "../models/MovimientoInventario";
import { AppError } from "../errors/AppError";

interface VentaInput {
  producto: string;
  cantidad: number;
}

export async function getAllVentas(_req: Request, res: Response) {
  res.json(
    await Venta.find().populate("productos.producto").sort({ createdAt: -1 }),
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

  const detalles: Array<{
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }> = [];
  const productosActualizados: Array<{
    producto: InstanceType<typeof Producto>;
    anterior: number;
    cantidad: number;
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
    const producto = await Producto.findById(item.producto);
    if (!producto)
      throw new AppError(`Producto no encontrado: ${item.producto}`, 404);
    if (producto.stock < item.cantidad)
      throw new AppError(`Stock insuficiente para ${producto.nombre}`, 409);
    detalles.push({
      producto: producto.id,
      cantidad: item.cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * item.cantidad,
    });
    productosActualizados.push({
      producto,
      anterior: producto.stock,
      cantidad: item.cantidad,
    });
  }

  for (const item of productosActualizados) {
    item.producto.stock -= item.cantidad;
    await item.producto.save();
    await MovimientoInventario.create({
      producto: item.producto.id,
      tipo: "salida",
      cantidad: item.cantidad,
      motivo: "Venta",
      stockAnterior: item.anterior,
      stockNuevo: item.producto.stock,
    });
  }
  const venta = await Venta.create({
    productos: detalles,
    total: detalles.reduce((total, item) => total + item.subtotal, 0),
  });
  res.status(201).json(venta);
}
