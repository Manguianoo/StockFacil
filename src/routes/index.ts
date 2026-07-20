import { Router } from "express";
import productRouter from "./productos";
import categoriaRouter from "./categorias";
import proveedorRouter from "./proveedores";
import inventarioRouter from "./inventario";
import ventasRouter from "./ventas";
import reporteRouter from "./reportes";
import authRouter from "./auth";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

router.get("/", (_req, res) => {
  res.json({ nombre: "StockFácil API", estado: "ok", documentacion: "/api" });
});

router.get("/api", (_req, res) => {
  res.json({
    recursos: [
      "/productos",
      "/categorias",
      "/proveedores",
      "/inventario",
      "/ventas",
      "/reportes",
      "/auth",
    ],
  });
});
router.use("/auth", authRouter);
router.use("/productos", productRouter);
router.use("/categorias", categoriaRouter);
router.use("/proveedores", proveedorRouter);
router.use("/inventario", inventarioRouter);
router.use("/ventas", ventasRouter);
router.use("/reportes", reporteRouter);

export default router;
