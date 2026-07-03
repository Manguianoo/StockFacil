import { Request, Response } from "express";

export function getAllProductos(_req: Request, res: Response) {
  res.send("Lista de Todos los productos dummy");
}

export function getProductoById(_req: Request, res: Response) {
  res.send("Producto por ID");
}

export function createProducto(_req: Request, res: Response) {
  res.send("Crear producto");
}

export function updateProducto(_req: Request, res: Response) {
  res.send("Actualizar producto");
}

export function deleteProducto(_req: Request, res: Response) {
  res.send("Eliminar producto");
}
