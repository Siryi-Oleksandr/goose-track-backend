import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/userControllers";
import { joiRegisterSchema, joiLoginSchema } from "../helpers";
import { isValidBody, authenticate } from "../middlewares";

const router = express.Router();

router.post("/register", isValidBody(joiRegisterSchema), register);
router.post("/login", isValidBody(joiLoginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrentUser);

export default router;
