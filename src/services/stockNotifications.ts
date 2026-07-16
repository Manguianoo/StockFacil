import { Producto } from "../models/Producto";
import { Usuario } from "../models/Usuario";
import { sendEmailSafely } from "./emailService";
import { emitRealtime } from "./realtime";

export async function notifyStockIfNeeded(productId: string) {
  const product = await Producto.findById(productId);
  if (!product || product.stock > product.stockMinimo) return;

  const payload = {
    id: product.id,
    nombre: product.nombre,
    sku: product.sku,
    stock: product.stock,
    stockMinimo: product.stockMinimo,
  };
  emitRealtime("stock:bajo", payload);
  const admins = await Usuario.find({ rol: "administrador", activo: true });
  for (const admin of admins) {
    sendEmailSafely({
      to: admin.email,
      subject: `Stock bajo: ${product.nombre}`,
      text: `${product.nombre} (${product.sku}) tiene ${product.stock} unidades; el mínimo configurado es ${product.stockMinimo}.`,
    });
  }
}
