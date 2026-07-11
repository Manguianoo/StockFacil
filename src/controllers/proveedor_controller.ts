import { Request, Response } from "express";
import { Proveedor } from "../models/Proveedor";
import { Producto } from "../models/Producto";
import { AppError } from "../errors/AppError";
import { requireFields, requireNonEmptyUpdate } from "../utils/validation";

export async function getAllProveedores(_req: Request, res: Response) {
  res.json(await Proveedor.find().sort({ nombre: 1 }));
}
export async function getProveedorById(req: Request, res: Response) {
  const item = await Proveedor.findById(req.params.id);
  if (!item) throw new AppError("Proveedor no encontrado", 404);
  res.json(item);
}
export async function createProveedor(req: Request, res: Response) {
  requireFields(req.body, ["nombre", "contacto"]);
  res.status(201).json(await Proveedor.create(req.body));
}
export async function updateProveedor(req: Request, res: Response) {
  requireNonEmptyUpdate(req.body);
  const item = await Proveedor.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!item) throw new AppError("Proveedor no encontrado", 404);
  res.json(item);
}
export async function deleteProveedor(req: Request, res: Response) {
  if (await Producto.exists({ proveedor: req.params.id }))
    throw new AppError("No se puede eliminar un proveedor con productos", 409);
  const item = await Proveedor.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError("Proveedor no encontrado", 404);
  res.status(204).send();
}
