import { Response } from "express";
import {
  controllerWrapper,
  HttpError,
  dateServise,
  statisticsAPI,
} from "../helpers";
import TaskModel from "../models/task";

// ******************* API:  /tasks  ******************

//* GET /tasks
const getTasks = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;
  const filterDate = dateServise.getFilterDate({ ...req.query });
  const regexDatePattern = new RegExp(`^${filterDate}`);
  const tasks = await TaskModel.find(
    { owner, date: { $regex: regexDatePattern } },
    "-createdAt -updatedAt"
  ).populate("owner", "name email avatarURL");
  res.json(tasks);
});

//* POST /tasks
const addTask = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;
  const { start, end } = req.body;

  if (!dateServise.isLaterEndTime(start, end)) {
    throw new HttpError(400, `Start time can't be in later then end time`);
  }

  const task = await TaskModel.create({
    ...req.body,
    owner,
  });

  res.status(201).json(task);
});

//* GET /tasks/:taskId
const getTaskById = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;
  const { _id: owner } = req.user;

  const task = await TaskModel.find(
    { _id: taskId, owner },
    "-createdAt -updatedAt"
  ).populate("owner", "name email avatarURL");

  if (!task) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json(task);
});

//* PATCH /tasks/:taskId
const updateTask = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;
  const { _id: owner } = req.user;
  const { start, end } = req.body;

  if (!dateServise.isLaterEndTime(start, end)) {
    throw new HttpError(400, `Start time can't be in later then end time`);
  }

  const task = await TaskModel.findOneAndUpdate(
    { _id: taskId, owner },
    req.body,
    {
      new: true,
    }
  );

  if (!task) {
    throw new HttpError(404, `Contact with ${taskId} not found`);
  }

  res.json(task);
});

//* DELETE /tasks/:taskId
const removeTask = controllerWrapper(async (req: any, res: Response) => {
  const { taskId } = req.params;
  const { _id: owner } = req.user;

  const removedTask = await TaskModel.findOneAndRemove({ _id: taskId, owner });
  if (!removedTask) {
    throw new HttpError(404, `Task with "${taskId}" not found`);
  }
  res.json({ message: "Task deleted" });
});

//* PATCH /tasks/category/:taskId
const updateTaskCategory = controllerWrapper(
  async (req: any, res: Response) => {
    const { taskId } = req.params;
    const { _id: owner } = req.user;

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, owner },
      req.body,
      {
        new: true,
      }
    );
    if (!task) {
      throw new HttpError(404, `Task with "${taskId}" not found`);
    }
    res.json(task);
  }
);

//* GET /task/statistics
const getStatistics = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;
  const { day } = req.query;
  const month = dateServise.getChoosedMonth(day);
  const regexDayPattern = new RegExp(`^${day}`);
  const regexMonthPattern = new RegExp(`^${month}`);

  const tasksByDay = await TaskModel.find({
    owner,
    date: { $regex: regexDayPattern },
  });

  const tasksByMonth = await TaskModel.find({
    owner,
    date: { $regex: regexMonthPattern },
  });

  const statisticsByDay = statisticsAPI.getStatisticByPeriod(tasksByDay);
  const statisticsByMonth = statisticsAPI.getStatisticByPeriod(tasksByMonth);

  res.json({ statisticsByDay, statisticsByMonth });
});

export {
  getTasks,
  addTask,
  getTaskById,
  updateTask,
  removeTask,
  updateTaskCategory,
  getStatistics,
};
