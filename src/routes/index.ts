import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import productRouter from "./productos";
import categoriaRouter from "./categorias";
import proveedorRouter from "./proveedores";
import inventarioRouter from "./inventario";
import ventasRouter from "./ventas";
import reporteRouter from "./reportes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Raiz (Login)");
});

//router.use(authMiddleware);
router.use("/productos", productRouter);
router.use("/categorias", categoriaRouter);
router.use("/proveedores", proveedorRouter);
router.use("/inventario", inventarioRouter);
router.use("/ventas", ventasRouter);
router.use("/reportes", reporteRouter);

export default router;
