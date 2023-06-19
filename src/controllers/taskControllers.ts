import { Response, Request } from "express";
import { controllerWrapper, HttpError } from "../helpers";
import TaskModel from "../models/task";

// ******************* API:  /tasks  ******************

//* GET /tasks
const getTasks = controllerWrapper(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query as {
    page?: number;
    limit?: number;
    // favorite?: boolean;
  };
  const skip = (page - 1) * limit;
  const tasks = await TaskModel.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json(tasks);
});

//* POST /tasks
const addTask = controllerWrapper(async (req: Request, res: Response) => {
  //   const { _id: owner } = req.user;
  //   const { path: tempUpload } = req.file;

  //   const fileData = await cloudinaryAPI.upload(tempUpload);
  //   await fs.unlink(tempUpload);

  const task = await TaskModel.create({
    ...req.body,
    // owner,
    // posterURL: fileData.url,
    // posterID: fileData.public_id,
  });

  res.status(201).json(task);
});

//* GET /tasks/:taskId
const getTaskById = controllerWrapper(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json(task);
});

//* DELETE /tasks/:taskId
const removeTask = controllerWrapper(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const removedTask = await TaskModel.findByIdAndRemove(taskId);
  if (!removedTask) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json({ message: "Task deleted" });
});

export { getTasks, addTask, getTaskById, removeTask };
