import { Router } from "express";
import {
  getReporteStockBajo,
  getReporteVentas,
  getReporteInventario,
  sendReporteEmail,
} from "../controllers/reporte_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, allowRoles("administrador"));
router.get("/stock-bajo", getReporteStockBajo);
router.get("/ventas", getReporteVentas);
router.get("/inventario", getReporteInventario);
router.post("/email", sendReporteEmail);

export default router;
