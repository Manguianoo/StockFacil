import { Router } from "express";
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoria_controller";
import { allowRoles, requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);
router.get("/", getAllCategorias);
router.get("/:id", getCategoriaById);
router.post("/", allowRoles("administrador"), createCategoria);
router.put("/:id", allowRoles("administrador"), updateCategoria);
router.delete("/:id", allowRoles("administrador"), deleteCategoria);

export default router;
