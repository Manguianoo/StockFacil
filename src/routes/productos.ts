import { Router } from "express";
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";
const router = Router();

router.use(requireAuth);
router.get("/", getAllProductos);
router.get("/:id", getProductoById);
router.post("/", allowRoles("administrador"), createProducto);
router.put("/:id", allowRoles("administrador"), updateProducto);
router.delete("/:id", allowRoles("administrador"), deleteProducto);

export default router;
