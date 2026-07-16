import type { RolUsuario } from "../models/Usuario";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nombre: string;
        email: string;
        rol: RolUsuario;
      };
    }
  }
}

export {};
