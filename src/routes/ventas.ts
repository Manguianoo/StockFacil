import { Router } from "express";
import {
  getAllVentas,
  getVentaById,
  createVenta,
} from "../controllers/ventas_controller";

const router = Router();

router.get("/", getAllVentas);
router.get("/:id", getVentaById);
router.post("/", createVenta); //detallar despues

export default router;
