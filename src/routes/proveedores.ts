import { Router } from "express";
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedor_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);
router.get("/", getAllProveedores);
router.get("/:id", getProveedorById);
router.post("/", allowRoles("administrador"), createProveedor);
router.put("/:id", allowRoles("administrador"), updateProveedor);
router.delete("/:id", allowRoles("administrador"), deleteProveedor);

export default router;
