import { HttpError } from "../helpers";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { assignTokens } from "../helpers";
import { Response, NextFunction } from "express";
const { ACCESS_TOKEN_SECRET_KEY = "", REFRESH_TOKEN_SECRET_KEY = "" } =
  process.env;

const authenticate = async (req: any, res: Response, next: NextFunction) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(new HttpError(401, "Not authorized (invlid or absent token)"));
  }

  let user: any;

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded) {
      throw new HttpError(401, "Not authorized");
    }
    user = await UserModel.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      throw new HttpError(401, "Not authorized");
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

    req.user = user; // add user to request and  we will have this info in controller
    next();
  } catch (err: any) {
    if (err.name !== "TokenExpiredError") {
      return next(new HttpError(401, err.message || "Not authorized"));
    }

    try {
      jwt.verify(user.refreshToken, REFRESH_TOKEN_SECRET_KEY);
      const { accessToken, refreshToken } = assignTokens(user);
      await UserModel.findByIdAndUpdate(user.userId, { refreshToken });
      res.json({ accessToken }); // ? this moment needs to be thinked
      // req.user = user; // add user to request and  we will have this info in controller
      // next();
    } catch (err) {
      next(new HttpError(401, "Refresh token is expired"));
    }
  }
};

export default authenticate;
