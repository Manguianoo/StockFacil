import { Router } from "express";
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedor_controller";

const router = Router();

router.get("/", getAllProveedores);
router.get("/:id", getProveedorById);
router.post("/", createProveedor);
router.put("/:id", updateProveedor);
router.delete("/:id", deleteProveedor);

export default router;
