import { Request, Response } from "express";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { HttpError, assignTokens, controllerWrapper } from "../helpers";
import UserModel from "../models/user";

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
  await UserModel.findByIdAndUpdate(newUser._id, { refreshToken, accessToken });

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
const login = controllerWrapper(async (_req: Request, res: Response) => {
  // const { email, password } = req.body;
  // const user = await User.findOne({ email });
  // if (!user) {
  //   throw new HttpError(401, `Email or password invalid`);
  // }

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   throw new HttpError(401, `Email or password invalid`);
  // }

  // const { accessToken, refreshToken } = assignTokens(user);
  // await User.findByIdAndUpdate(user._id, { refreshToken });

  res.json({
    all: "ok",
    // accessToken,
    // user: {
    //   name: user.name,
    //   email: user.email,
    //   subscription: user.subscription,
    // },
  });
});

// * exports
export { register, login };
