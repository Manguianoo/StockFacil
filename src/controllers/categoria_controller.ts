import { Request, Response } from "express";
import { Categoria } from "../models/Categoria";
import { Producto } from "../models/Producto";
import { AppError } from "../errors/AppError";
import { requireFields, requireNonEmptyUpdate } from "../utils/validation";

export async function getAllCategorias(_req: Request, res: Response) {
  res.json(await Categoria.find().sort({ nombre: 1 }));
}
export async function getCategoriaById(req: Request, res: Response) {
  const item = await Categoria.findById(req.params.id);
  if (!item) throw new AppError("Categoría no encontrada", 404);
  res.json(item);
}
export async function createCategoria(req: Request, res: Response) {
  requireFields(req.body, ["nombre"]);
  res.status(201).json(await Categoria.create(req.body));
}
export async function updateCategoria(req: Request, res: Response) {
  requireNonEmptyUpdate(req.body);
  const item = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!item) throw new AppError("Categoría no encontrada", 404);
  res.json(item);
}
export async function deleteCategoria(req: Request, res: Response) {
  if (await Producto.exists({ categoria: req.params.id }))
    throw new AppError("No se puede eliminar una categoría con productos", 409);
  const item = await Categoria.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError("Categoría no encontrada", 404);
  res.status(204).send();
}
