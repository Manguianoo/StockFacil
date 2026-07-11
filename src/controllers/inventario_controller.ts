import { Request, Response } from "express";
import { MovimientoInventario } from "../models/MovimientoInventario";
import { Producto } from "../models/Producto";
import { AppError } from "../errors/AppError";
import { requireFields } from "../utils/validation";

export async function getAllMovimientos(_req: Request, res: Response) {
  res.json(
    await MovimientoInventario.find()
      .populate("producto")
      .sort({ createdAt: -1 }),
  );
}
export async function getMovimientoById(req: Request, res: Response) {
  const item = await MovimientoInventario.findById(req.params.id).populate(
    "producto",
  );
  if (!item) throw new AppError("Movimiento no encontrado", 404);
  res.json(item);
}
async function registrar(
  req: Request,
  res: Response,
  tipo: "entrada" | "salida",
) {
  requireFields(req.body, ["producto", "cantidad", "motivo"]);
  const cantidad = Number(req.body.cantidad);
  if (!Number.isInteger(cantidad) || cantidad <= 0)
    throw new AppError("La cantidad debe ser un entero mayor que cero", 400);
  const producto = await Producto.findById(req.body.producto);
  if (!producto) throw new AppError("Producto no encontrado", 404);
  if (tipo === "salida" && producto.stock < cantidad)
    throw new AppError("Stock insuficiente", 409);
  const anterior = producto.stock;
  producto.stock += tipo === "entrada" ? cantidad : -cantidad;
  await producto.save();
  const movimiento = await MovimientoInventario.create({
    producto: producto.id,
    tipo,
    cantidad,
    motivo: req.body.motivo,
    stockAnterior: anterior,
    stockNuevo: producto.stock,
  });
  res.status(201).json(movimiento);
}
export async function registrarEntrada(req: Request, res: Response) {
  await registrar(req, res, "entrada");
}
export async function registrarSalida(req: Request, res: Response) {
  await registrar(req, res, "salida");
}
