import { model, Schema } from "mongoose";

const categoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 80,
    },
    descripcion: { type: String, trim: true, maxlength: 300, default: "" },
  },
  { timestamps: true, versionKey: false },
);

export const Categoria = model("Categoria", categoriaSchema);
