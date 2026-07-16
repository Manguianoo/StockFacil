import { model, Schema } from "mongoose";

export type RolUsuario = "administrador" | "operativo";

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo inválido"],
    },
    passwordHash: { type: String, required: true, select: false },
    rol: {
      type: String,
      enum: ["administrador", "operativo"],
      default: "operativo",
      required: true,
    },
    activo: { type: Boolean, default: true },
    resetPasswordHash: { type: String, select: false },
    resetPasswordExpira: { type: Date, select: false },
  },
  { timestamps: true, versionKey: false },
);

usuarioSchema.set("toJSON", {
  transform: (_document, returned) => {
    const safe = returned as Record<string, unknown>;
    delete safe.passwordHash;
    delete safe.resetPasswordHash;
    delete safe.resetPasswordExpira;
    return returned;
  },
});

export const Usuario = model("Usuario", usuarioSchema);
