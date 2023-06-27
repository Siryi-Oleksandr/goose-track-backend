import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  update,
  changePassword,
  googleAuth,
} from "../controllers/userControllers";
import { joiAPI } from "../helpers";
import { isValidBody, authenticate, upload, passport } from "../middlewares";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), googleAuth);


router.post("/register", isValidBody(joiAPI.registerSchema), register);
router.post("/login", isValidBody(joiAPI.loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrentUser);
router.patch(
  "/update",
  authenticate,
  upload.single("avatar"),
  isValidBody(joiAPI.updateUserSchema),
  update
);
router.patch(
  "/changePassword",
  authenticate,
  isValidBody(joiAPI.userPasswordSchema),
  changePassword
);

export default router;
