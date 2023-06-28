import { HttpError } from "../helpers";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { Response, NextFunction } from "express";
const { ACCESS_TOKEN_SECRET_KEY = "" } = process.env;

const auth = async (req: any, _res: Response, next: NextFunction) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(new HttpError(401, "Not authorized"));
  }

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded) {
      throw new HttpError(401, "Not authorized");
    }
    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.accessToken) {
      throw new HttpError(401, "Not authorized");
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

    req.user = user; // add user to request and  we will have this info in controller
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
};

export default auth;
