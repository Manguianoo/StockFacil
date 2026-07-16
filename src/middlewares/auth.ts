import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { RolUsuario, Usuario } from "../models/Usuario";

interface TokenPayload {
  sub: string;
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET no está configurado", 500);
  return secret;
}

async function resolveUser(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret()) as TokenPayload;
    const user = await Usuario.findById(payload.sub);
    if (!user || !user.activo) return undefined;
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol as RolUsuario,
    };
  } catch {
    return undefined;
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.user = await resolveUser(req);
  next();
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.user = await resolveUser(req);
  if (!req.user) throw new AppError("Autenticación requerida", 401);
  next();
}

export function allowRoles(...roles: RolUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Autenticación requerida", 401);
    if (!roles.includes(req.user.rol))
      throw new AppError("No tiene permiso para realizar esta acción", 403);
    next();
  };
}
