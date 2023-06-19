import express from "express";
import {
  getTasks,
  addTask,
  getTaskById,
  removeTask,
} from "../controllers/taskControllers";
import { isValidId, isValidBody } from "../middlewares";
import { joiTasksSchema } from "../helpers";

const router = express.Router();

router.get("/", getTasks);
router.get("/:taskId", isValidId, getTaskById);
router.post("/", isValidBody(joiTasksSchema), addTask);
router.delete("/:taskId", isValidId, removeTask);

export default router;
