import express from "express";
import { register, login } from "../controllers/userControllers";
import { joiRegisterSchema, joiLoginSchema } from "../helpers";
import { isValidBody } from "../middlewares";

const router = express.Router();

router.post("/register", isValidBody(joiRegisterSchema), register);
router.post("/login", isValidBody(joiLoginSchema), login);

export default router;
