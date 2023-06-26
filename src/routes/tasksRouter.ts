import express from "express";
import {
  getTasks,
  addTask,
  getTaskById,
  removeTask,
  updateTask,
  updateTaskCategory,
  getStatistics,
} from "../controllers/taskControllers";
import { isValidId, isValidBody, authenticate } from "../middlewares";
import { joiAPI } from "../helpers";

const router = express.Router();

router.use(authenticate); // checks user before all routes and actions

router.get("/", getTasks);
router.get("/statistics", getStatistics);
router.get("/:taskId", isValidId, getTaskById);
router.post("/", isValidBody(joiAPI.tasksSchema), addTask);
router.patch(
  "/:taskId",
  isValidId,
  isValidBody(joiAPI.tasksSchema),
  updateTask
);
router.delete("/:taskId", isValidId, removeTask);
router.patch(
  "/category/:taskId",
  isValidId,
  isValidBody(joiAPI.taskCategorySchema),
  updateTaskCategory
);

export default router;
