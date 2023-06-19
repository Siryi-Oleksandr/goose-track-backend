import { NextFunction } from "express";

const handleMongooseError = (error: any, next: NextFunction) => {
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  next();
};

export default handleMongooseError;
