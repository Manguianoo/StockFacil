import { Router } from "express";
import {
  forgotPassword,
  listUsers,
  login,
  me,
  register,
  resetPassword,
} from "../controllers/auth_controller";
import { allowRoles, optionalAuth, requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", optionalAuth, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, me);
router.get("/users", requireAuth, allowRoles("administrador"), listUsers);

export default router;
