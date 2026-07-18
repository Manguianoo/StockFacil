import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { RolUsuario, Usuario } from "../models/Usuario";

interface TokenPayload {
  sub: string;
}

export interface AuthenticatedUser {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET no está configurado", 500);
  return secret;
}

export function createAccessToken(userId: string) {
  return jwt.sign({}, getJwtSecret(), {
    subject: userId,
    expiresIn: "8h",
  });
}

export async function authenticateToken(token: string) {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as TokenPayload;
    const user = await Usuario.findById(payload.sub);
    if (!user?.activo) return undefined;
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol as RolUsuario,
    } satisfies AuthenticatedUser;
  } catch {
    return undefined;
  }
}
