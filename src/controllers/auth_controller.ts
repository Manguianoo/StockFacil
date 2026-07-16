import { createHash, randomBytes } from "crypto";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { getJwtSecret } from "../middlewares/auth";
import { RolUsuario, Usuario } from "../models/Usuario";
import { sendEmailSafely } from "../services/emailService";
import { requireFields } from "../utils/validation";

const normalizeEmail = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

function publicUser(user: InstanceType<typeof Usuario>) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  };
}

function createToken(user: InstanceType<typeof Usuario>) {
  return jwt.sign({}, getJwtSecret(), {
    subject: user.id,
    expiresIn: "8h",
  });
}

export async function register(req: Request, res: Response) {
  requireFields(req.body, ["nombre", "email", "password"]);
  const totalUsers = await Usuario.countDocuments();
  if (totalUsers > 0 && req.user?.rol !== "administrador")
    throw new AppError("Solo un administrador puede registrar usuarios", 403);

  const password = String(req.body.password);
  if (password.length < 8)
    throw new AppError("La contraseña debe tener al menos 8 caracteres", 400);
  const rol: RolUsuario =
    totalUsers === 0
      ? "administrador"
      : req.body.rol === "administrador"
        ? "administrador"
        : "operativo";
  const user = await Usuario.create({
    nombre: req.body.nombre,
    email: normalizeEmail(req.body.email),
    passwordHash: await bcrypt.hash(password, 12),
    rol,
  });

  sendEmailSafely({
    to: user.email,
    subject: "Bienvenido a StockFácil",
    text: `Hola ${user.nombre}, tu cuenta ${rol} fue creada correctamente.`,
  });
  res.status(201).json({ token: createToken(user), user: publicUser(user) });
}

export async function login(req: Request, res: Response) {
  requireFields(req.body, ["email", "password"]);
  const user = await Usuario.findOne({
    email: normalizeEmail(req.body.email),
  }).select("+passwordHash");
  if (
    !user ||
    !(await bcrypt.compare(String(req.body.password), user.passwordHash))
  )
    throw new AppError("Correo o contraseña incorrectos", 401);
  if (!user.activo) throw new AppError("La cuenta está desactivada", 403);
  res.json({ token: createToken(user), user: publicUser(user) });
}

export async function me(req: Request, res: Response) {
  res.json(req.user);
}

export async function forgotPassword(req: Request, res: Response) {
  requireFields(req.body, ["email"]);
  const user = await Usuario.findOne({ email: normalizeEmail(req.body.email) });
  if (user) {
    const resetToken = randomBytes(32).toString("hex");
    user.resetPasswordHash = createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpira = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    sendEmailSafely({
      to: user.email,
      subject: "Restablece tu contraseña de StockFácil",
      text: `Abre este enlace durante los próximos 30 minutos: ${baseUrl}/?resetToken=${resetToken}`,
    });
  }
  res.json({
    message: "Si la cuenta existe, recibirá instrucciones por correo",
  });
}

export async function resetPassword(req: Request, res: Response) {
  requireFields(req.body, ["token", "password"]);
  const password = String(req.body.password);
  if (password.length < 8)
    throw new AppError("La contraseña debe tener al menos 8 caracteres", 400);
  const hash = createHash("sha256")
    .update(String(req.body.token))
    .digest("hex");
  const user = await Usuario.findOne({
    resetPasswordHash: hash,
    resetPasswordExpira: { $gt: new Date() },
  }).select("+resetPasswordHash +resetPasswordExpira");
  if (!user) throw new AppError("El enlace es inválido o expiró", 400);
  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordHash = undefined;
  user.resetPasswordExpira = undefined;
  await user.save();
  res.json({ message: "Contraseña actualizada" });
}

export async function listUsers(_req: Request, res: Response) {
  res.json(await Usuario.find().sort({ nombre: 1 }));
}
