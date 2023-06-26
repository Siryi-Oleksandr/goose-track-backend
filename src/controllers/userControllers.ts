import { Request, Response } from "express";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { HttpError, assignTokens, controllerWrapper } from "../helpers";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";
const {
  ACCESS_TOKEN_SECRET_KEY = "",
  REFRESH_TOKEN_SECRET_KEY = "",
  FRONTEND_URL = "",
} = process.env;

// ******************* API:  /auth  ******************

interface RequestBody {
  email: string;
  password: string;
  name?: string;
  // Other properties in the req.body if applicable
}

//* POST /register
const register = controllerWrapper(async (req: Request, res: Response) => {
  const { email, password }: RequestBody = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new HttpError(409, `Email "${email}" already exists`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, {
    s: "250",
  });

  const newUser = await UserModel.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });

  const { accessToken, refreshToken } = assignTokens(newUser);
  await UserModel.findByIdAndUpdate(newUser._id, { refreshToken });

  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
});

//* POST /login
const login = controllerWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new HttpError(401, `Email or password invalid`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, `Email or password invalid`);
  }

  const { accessToken, refreshToken } = assignTokens(user);
  await UserModel.findByIdAndUpdate(user._id, { refreshToken });

  res.json({
    accessToken,
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

//* POST /logout
const logout = controllerWrapper(async (req: any, res: Response) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { refreshToken: null });

  res.status(200).json({ message: "logout successfull" });
});

const googleAuth = async (req: any, res: Response) => {
  const { _id: id } = req.user;

  const payload: {
    id: string;
  } = { id };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
  await UserModel.findByIdAndUpdate(id, { accessToken, refreshToken });

  res.redirect(
    `${FRONTEND_URL}?accessToken=${accessToken}&refreshToken${refreshToken}`
  );
};

// * exports
export { register, login, logout, googleAuth };
