import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  update,
  changePassword,
} from "../controllers/userControllers";
import {
  joiRegisterSchema,
  joiLoginSchema,
  joiUpdateUserSchema,
  joiUserPasswordSchema,
} from "../helpers";
import { isValidBody, authenticate, upload } from "../middlewares";

const router = express.Router();

router.post("/register", isValidBody(joiRegisterSchema), register);
router.post("/login", isValidBody(joiLoginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrentUser);
router.patch(
  "/update",
  authenticate,
  upload.single("avatar"),
  isValidBody(joiUpdateUserSchema),
  update
);
router.patch(
  "/changePassword",
  authenticate,
  isValidBody(joiUserPasswordSchema),
  changePassword
);

export default router;
