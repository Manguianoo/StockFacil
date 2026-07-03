import { Request, Response } from "express";

export function getAllMovimientos(_req: Request, res: Response) {
  res.send("Listar todos los movimientos");
}

export function getMovimientoById(_req: Request, res: Response) {
  res.send("Obtener movimiento por ID");
}

export function registrarEntrada(_req: Request, res: Response) {
  res.send("Registrar entrada");
}

export function registrarSalida(_req: Request, res: Response) {
  res.send("Registrar salida");
}
