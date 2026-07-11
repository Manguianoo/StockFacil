import { model, Schema } from "mongoose";

const proveedorSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    contacto: { type: String, required: true, trim: true, maxlength: 120 },
    telefono: { type: String, trim: true, maxlength: 20, default: "" },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: "",
    },
  },
  { timestamps: true, versionKey: false },
);

export const Proveedor = model("Proveedor", proveedorSchema);
