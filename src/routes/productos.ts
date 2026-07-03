import { Router } from "express";
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos_controller";
const router = Router();

router.get("/", getAllProductos);
router.get("/:id", getProductoById);
router.post("/", createProducto); //detallar despues
router.put("/:id", updateProducto); //detallar despues
router.delete("/:id", deleteProducto); //detallar despues

export default router;
