import { Request, Response } from "express";

export function getAllProveedores(_req: Request, res: Response) {
  res.send("Todos los proveedores");
}

export function getProveedorById(_req: Request, res: Response) {
  res.send("Proveedor por ID");
}

export function createProveedor(_req: Request, res: Response) {
  res.send("Crear proveedor");
}

export function updateProveedor(_req: Request, res: Response) {
  res.send("Actualizar proveedor");
}

export function deleteProveedor(_req: Request, res: Response) {
  res.send("Eliminar proveedor");
}
