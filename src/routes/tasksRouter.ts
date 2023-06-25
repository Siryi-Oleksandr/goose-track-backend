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
import { joiTasksSchema, joiTaskCategorySchema } from "../helpers";

const router = express.Router();

router.use(authenticate); // checks user before all routes and actions

router.get("/", getTasks);
router.get("/statistics", getStatistics);
router.get("/:taskId", isValidId, getTaskById);
router.post("/", isValidBody(joiTasksSchema), addTask);
router.patch("/:taskId", isValidId, isValidBody(joiTasksSchema), updateTask);
router.delete("/:taskId", isValidId, removeTask);
router.patch(
  "/category/:taskId",
  isValidId,
  isValidBody(joiTaskCategorySchema),
  updateTaskCategory
);

export default router;
