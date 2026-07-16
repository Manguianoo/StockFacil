import { Router } from "express";
import {
  getAllVentas,
  getVentaById,
  createVenta,
} from "../controllers/ventas_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, allowRoles("administrador", "operativo"));
router.get("/", getAllVentas);
router.get("/:id", getVentaById);
router.post("/", createVenta);

export default router;
