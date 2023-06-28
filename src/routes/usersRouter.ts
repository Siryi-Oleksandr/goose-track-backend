import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  update,
  changePassword,
  googleAuth,
} from "../controllers/userControllers";
import { joiAPI } from "../helpers";
import { isValidBody, auth, upload, passport } from "../middlewares";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuth
);

router.post("/register", isValidBody(joiAPI.registerSchema), register);
router.post("/login", isValidBody(joiAPI.loginSchema), login);
router.post("/refresh", isValidBody(joiAPI.refreshSchema), refresh);
router.post("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch(
  "/update",
  auth,
  upload.single("avatar"),
  isValidBody(joiAPI.updateUserSchema),
  update
);
router.patch(
  "/changePassword",
  auth,
  isValidBody(joiAPI.userPasswordSchema),
  changePassword
);

export default router;
