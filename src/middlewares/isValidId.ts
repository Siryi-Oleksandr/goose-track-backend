import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers";

const isValidId = (req: Request, _res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  if (!isValidObjectId(projectId)) {
    next(new HttpError(400, `${projectId} is not valid id`));
  }
  next();
};

export default isValidId;
