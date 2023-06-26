import express from "express";
import {
  register,
  login,
  logout,
  googleAuth,
} from "../controllers/userControllers";
import { joiRegisterSchema, joiLoginSchema } from "../helpers";
import { isValidBody, authenticate, passport } from "../middlewares";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }, googleAuth)
);

router.post("/register", isValidBody(joiRegisterSchema), register);
router.post("/login", isValidBody(joiLoginSchema), login);
router.post("/logout", authenticate, logout);

export default router;
