import { Request, Response, NextFunction } from "express";
import { HttpError } from "../helpers";
import { Schema } from "joi";

const isValidBody = (JoiSchema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      next(new HttpError(422, error.message));
      return;
    }
    next();
  };
};

export default isValidBody;
