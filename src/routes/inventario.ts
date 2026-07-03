import { Router } from "express";
import {
  getAllMovimientos,
  getMovimientoById,
  registrarEntrada,
  registrarSalida,
} from "../controllers/inventario_controller";

const router = Router();

router.get("/", getAllMovimientos);
router.get("/entrada", registrarEntrada); //será POST
router.get("/salida", registrarSalida); //será POST
router.get("/:id", getMovimientoById);

export default router;
