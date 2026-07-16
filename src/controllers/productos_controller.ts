import { Request, Response } from "express";
import { Producto } from "../models/Producto";
import { Categoria } from "../models/Categoria";
import { Proveedor } from "../models/Proveedor";
import { AppError } from "../errors/AppError";
import { requireFields, requireNonEmptyUpdate } from "../utils/validation";
import { emitRealtime } from "../services/realtime";

async function validateRelations(body: Record<string, unknown>) {
  if (body.categoria && !(await Categoria.exists({ _id: body.categoria })))
    throw new AppError("La categoría no existe", 400);
  if (body.proveedor && !(await Proveedor.exists({ _id: body.proveedor })))
    throw new AppError("El proveedor no existe", 400);
}
export async function getAllProductos(req: Request, res: Response) {
  const filter =
    req.query.activo === undefined
      ? {}
      : { activo: req.query.activo === "true" };
  res.json(
    await Producto.find(filter)
      .populate("categoria proveedor")
      .sort({ nombre: 1 }),
  );
}
export async function getProductoById(req: Request, res: Response) {
  const item = await Producto.findById(req.params.id).populate(
    "categoria proveedor",
  );
  if (!item) throw new AppError("Producto no encontrado", 404);
  res.json(item);
}
export async function createProducto(req: Request, res: Response) {
  requireFields(req.body, ["nombre", "sku", "precio", "categoria"]);
  await validateRelations(req.body);
  const product = await Producto.create(req.body);
  emitRealtime("producto:creado", product);
  res.status(201).json(product);
}
export async function updateProducto(req: Request, res: Response) {
  requireNonEmptyUpdate(req.body);
  await validateRelations(req.body);
  const item = await Producto.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!item) throw new AppError("Producto no encontrado", 404);
  emitRealtime("producto:actualizado", item);
  res.json(item);
}
export async function deleteProducto(req: Request, res: Response) {
  const item = await Producto.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError("Producto no encontrado", 404);
  res.status(204).send();
}
