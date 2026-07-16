import { Router } from "express";
import {
  getAllMovimientos,
  getMovimientoById,
  registrarEntrada,
  registrarSalida,
} from "../controllers/inventario_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, allowRoles("administrador", "operativo"));
router.get("/", getAllMovimientos);
router.post("/entrada", registrarEntrada);
router.post("/salida", registrarSalida);
router.get("/:id", getMovimientoById);

export default router;
