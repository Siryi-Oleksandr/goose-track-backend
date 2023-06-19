import express from "express";
import { signup } from "../controllers/userControllers";

const router = express.Router();

router.post("/signup", signup);

export default router;
