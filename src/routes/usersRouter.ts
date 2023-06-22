import express from "express";
import { register } from "../controllers/userControllers";
import { joiRegisterSchema } from "../helpers";
import { isValidBody } from "../middlewares";

const router = express.Router();

router.post("/register", isValidBody(joiRegisterSchema), register);

export default router;
