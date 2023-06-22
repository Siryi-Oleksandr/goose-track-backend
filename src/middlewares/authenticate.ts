import { HttpError } from "../helpers";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { assignTokens } from "../helpers";
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(new HttpError(401, "Not authorized (invlid or absent token)"));
  }

  let user;

  try {
    const decoded = jwt.decode(token);
    user = await User.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      throw new HttpError(401, "Not authorized");
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

    req.user = user; // add user to request and  we will have this info in controller
    next();
  } catch (err) {
    if (err.name !== "TokenExpiredError")
      return next(new HttpError(401, err.message || "Not authorized"));

    try {
      jwt.verify(user.refreshToken, REFRESH_TOKEN_SECRET_KEY);
      const { accessToken, refreshToken } = assignTokens(user);
      await User.findByIdAndUpdate(user.userId, { refreshToken });
      res.json({ accessToken });
      // next();
    } catch (err) {
      next(new HttpError(401, "refresh token is expired"));
    }
  }
};

module.exports = authenticate;
