import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers";

const isValidId = (req: Request, _res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  if (!isValidObjectId(taskId)) {
    next(new HttpError(400, `"${taskId}" is not valid id`));
  }
  next();
};

export default isValidId;
