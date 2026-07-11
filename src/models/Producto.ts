import { model, Schema } from "mongoose";

const productoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 40,
    },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    stockMinimo: { type: Number, required: true, min: 0, default: 5 },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
    proveedor: { type: Schema.Types.ObjectId, ref: "Proveedor", default: null },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export const Producto = model("Producto", productoSchema);
