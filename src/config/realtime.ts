import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { getJwtSecret } from "../middlewares/auth";
import { Usuario } from "../models/Usuario";
import { configureRealtime } from "../services/realtime";

interface TokenPayload {
  sub: string;
}

export function createRealtimeServer(httpServer: HttpServer) {
  const io = new Server(httpServer);
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const payload = jwt.verify(String(token), getJwtSecret()) as TokenPayload;
      const user = await Usuario.findById(payload.sub);
      if (!user?.activo) return next(new Error("No autorizado"));
      socket.data.userId = user.id;
      socket.data.rol = user.rol;
      next();
    } catch {
      next(new Error("No autorizado"));
    }
  });
  configureRealtime(io);
  return io;
}
