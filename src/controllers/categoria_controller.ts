import { Request, Response } from "express";

export function getAllCategorias(_req: Request, res: Response) {
  res.send("Todas las categorias");
}

export function getCategoriaById(_req: Request, res: Response) {
  res.send("Categoria por ID");
}

export function createCategoria(_req: Request, res: Response) {
  res.send("Crear categoria");
}

export function updateCategoria(_req: Request, res: Response) {
  res.send("Actualizar categoria");
}

export function deleteCategoria(_req: Request, res: Response) {
  res.send("Eliminar categoria");
}
