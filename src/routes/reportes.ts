import { Router } from "express";
import {
  getReporteStockBajo,
  getReporteVentas,
  getReporteInventario,
} from "../controllers/reporte_controller";

const router = Router();

router.get("/stock-bajo", getReporteStockBajo);
router.get("/ventas", getReporteVentas);
router.get("/inventario", getReporteInventario);

export default router;
