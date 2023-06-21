import express from "express";
import {
  getTasks,
  addTask,
  getTaskById,
  removeTask,
  updateTask,
} from "../controllers/taskControllers";
import { isValidId, isValidBody } from "../middlewares";
import { joiTasksSchema } from "../helpers";

const router = express.Router();

router.get("/", getTasks);
router.get("/:taskId", isValidId, getTaskById);
router.post("/", isValidBody(joiTasksSchema), addTask);
router.patch("/:taskId", isValidId, isValidBody(joiTasksSchema), updateTask);
router.delete("/:taskId", isValidId, removeTask);

export default router;
