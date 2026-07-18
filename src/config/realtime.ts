import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { authenticateToken } from "../services/authService";
import { configureRealtime } from "../services/realtime";

export function createRealtimeServer(httpServer: HttpServer) {
  const io = new Server(httpServer);
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await authenticateToken(String(token));
      if (!user) return next(new Error("No autorizado"));
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
