import { Request, Response } from "express";

export function getAllVentas(_req: Request, res: Response) {
  res.send("Todas las ventas");
}

export function getVentaById(_req: Request, res: Response) {
  res.send("Obtener venta por ID");
}

export function createVenta(_req: Request, res: Response) {
  res.send("Crear venta");
}
