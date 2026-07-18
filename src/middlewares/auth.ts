import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { RolUsuario } from "../models/Usuario";
import { authenticateToken } from "../services/authService";

async function resolveUser(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;

  return authenticateToken(header.slice(7));
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
