import { model, Schema } from "mongoose";

const movimientoSchema = new Schema(
  {
    producto: { type: Schema.Types.ObjectId, ref: "Producto", required: true },
    tipo: { type: String, enum: ["entrada", "salida"], required: true },
    cantidad: { type: Number, required: true, min: 1 },
    motivo: { type: String, required: true, trim: true, maxlength: 200 },
    stockAnterior: { type: Number, required: true, min: 0 },
    stockNuevo: { type: Number, required: true, min: 0 },
    registradoPor: { type: Schema.Types.ObjectId, ref: "Usuario" },
  },
  { timestamps: true, versionKey: false },
);

export const MovimientoInventario = model(
  "MovimientoInventario",
  movimientoSchema,
);
