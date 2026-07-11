import { model, Schema } from "mongoose";

const detalleSchema = new Schema(
  {
    producto: { type: Schema.Types.ObjectId, ref: "Producto", required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const ventaSchema = new Schema(
  {
    productos: {
      type: [detalleSchema],
      required: true,
      validate: [(v: unknown[]) => v.length > 0, "La venta requiere productos"],
    },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const Venta = model("Venta", ventaSchema);
