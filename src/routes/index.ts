import { Router } from "express";
import productRouter from "./productos";
import categoriaRouter from "./categorias";
import proveedorRouter from "./proveedores";
import inventarioRouter from "./inventario";
import ventasRouter from "./ventas";
import reporteRouter from "./reportes";

const router = Router();

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
    ],
  });
});
router.use("/productos", productRouter);
router.use("/categorias", categoriaRouter);
router.use("/proveedores", proveedorRouter);
router.use("/inventario", inventarioRouter);
router.use("/ventas", ventasRouter);
router.use("/reportes", reporteRouter);

export default router;
