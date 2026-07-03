import { Request, Response } from "express";

export function getReporteStockBajo(_req: Request, res: Response) {
  res.send("Bajo stock");
}

export function getReporteVentas(_req: Request, res: Response) {
  res.send("Reporte de ventas");
}

export function getReporteInventario(_req: Request, res: Response) {
  res.send("Reporte de inventario");
}
