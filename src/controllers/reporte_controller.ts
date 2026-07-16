import { Request, Response } from "express";
import { Producto } from "../models/Producto";
import { Venta } from "../models/Venta";
import { MovimientoInventario } from "../models/MovimientoInventario";
import { AppError } from "../errors/AppError";
import { sendEmail } from "../services/emailService";

export async function getReporteStockBajo(_req: Request, res: Response) {
  const productos = await Producto.find({
    $expr: { $lte: ["$stock", "$stockMinimo"] },
    activo: true,
  }).populate("categoria");
  res.json({ cantidad: productos.length, productos });
}
export async function getReporteVentas(req: Request, res: Response) {
  const desde = req.query.desde
    ? new Date(String(req.query.desde))
    : new Date(0);
  const hasta = req.query.hasta
    ? new Date(String(req.query.hasta))
    : new Date();
  const ventas = await Venta.find({ createdAt: { $gte: desde, $lte: hasta } });
  res.json({
    cantidad: ventas.length,
    total: ventas.reduce((sum, venta) => sum + venta.total, 0),
    ventas,
  });
}
export async function getReporteInventario(_req: Request, res: Response) {
  const [productos, movimientos] = await Promise.all([
    Producto.find().populate("categoria proveedor"),
    MovimientoInventario.countDocuments(),
  ]);
  res.json({
    productos,
    movimientos,
    valorInventario: productos.reduce(
      (sum, producto) => sum + producto.stock * producto.precio,
      0,
    ),
  });
}

export async function sendReporteEmail(req: Request, res: Response) {
  if (!req.user) throw new AppError("Autenticación requerida", 401);
  const [ventas, productos, movimientos] = await Promise.all([
    Venta.find(),
    Producto.find(),
    MovimientoInventario.countDocuments(),
  ]);
  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const stockBajo = productos.filter(
    (producto) => producto.activo && producto.stock <= producto.stockMinimo,
  ).length;
  const sent = await sendEmail({
    to: req.user.email,
    subject: "Resumen de StockFácil",
    text: [
      `Ventas registradas: ${ventas.length}`,
      `Total vendido: $${totalVentas.toFixed(2)}`,
      `Movimientos de inventario: ${movimientos}`,
      `Productos con stock bajo: ${stockBajo}`,
    ].join("\n"),
  });
  if (!sent) throw new AppError("Configure SMTP para enviar reportes", 503);
  res.json({ message: `Reporte enviado a ${req.user.email}` });
}
