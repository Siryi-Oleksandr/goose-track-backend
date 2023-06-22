import { Response } from "express";
import { controllerWrapper, HttpError } from "../helpers";
import TaskModel from "../models/task";

// ******************* API:  /tasks  ******************

//* GET /tasks
const getTasks = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query as {
    page?: number;
    limit?: number; // TODO create get tasks for month
    // favorite?: boolean;
  };
  const skip = (page - 1) * limit;
  const tasks = await TaskModel.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email avatarURL");
  res.json(tasks);
});

//* POST /tasks
const addTask = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;
  const task = await TaskModel.create({
    ...req.body,
    owner,
  });

  res.status(201).json(task);
});

//* GET /tasks/:taskId
const getTaskById = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;
  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json(task);
});

//* PATCH /tasks/:taskId
const updateTask = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;

  const task = await TaskModel.findByIdAndUpdate(taskId, req.body, {
    new: true,
  });

  if (!task) {
    throw new HttpError(404, `Contact with ${taskId} not found`);
  }

  res.json(task);
});

//* DELETE /tasks/:taskId
const removeTask = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;
  const removedTask = await TaskModel.findByIdAndRemove(taskId);
  if (!removedTask) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json({ message: "Task deleted" });
});

export { getTasks, addTask, getTaskById, updateTask, removeTask };

// GET https://goose-track-verq.onrender.com/tasks/ - отримати таски
// GET https://goose-track-verq.onrender.com/tasks/?page=1&limit=10 - отримати таски з пагінацією
// POST https://goose-track-verq.onrender.com/tasks - додати таску
// GET https://goose-track-verq.onrender.com/tasks/:taskID - отримати конкретну таску
// PATCH  https://goose-track-verq.onrender.com/tasks/:taskID - змінити  конкретну таску
// DELETE  https://goose-track-verq.onrender.com/tasks/:taskID - видалити конкретну таску
