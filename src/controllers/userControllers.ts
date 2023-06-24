import { Request, Response } from "express";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import fs from "fs/promises";
import {
  HttpError,
  assignTokens,
  controllerWrapper,
  cloudinaryAPI,
} from "../helpers";
import UserModel from "../models/user";

// ******************* API:  /auth  ******************

interface RequestBody {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  skype?: string;
  birthday?: string;
  avatarURL: string;
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

//* GET /current
const getCurrentUser = controllerWrapper(async (req: any, res: Response) => {
  const { email, name, avatarURL } = req.user;
  res.json({ name, email, avatarURL });
});

//* PATCH /update
const update = controllerWrapper(async (req: any, res: Response) => {
  const { _id, avatarID, avatarURL } = req.user;
  const { email } = req.body;

  const existedUser = await UserModel.findOne({ email });
  if (existedUser) {
    throw new HttpError(409, `Email "${email}" already exists`);
  }
  let newAvatarURL = avatarURL;
  let newAvatarID = avatarID;

  if (req.file) {
    const { path: tempUpload } = req.file;
    const fileData = await cloudinaryAPI.upload(tempUpload);
    newAvatarURL = fileData.url;
    newAvatarID = fileData.public_id;
    await fs.unlink(tempUpload);

    if (avatarID) {
      await cloudinaryAPI.delete(avatarID);
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    _id,
    {
      ...req.body,
      avatarURL: newAvatarURL,
      avatarID: newAvatarID,
    },
    {
      new: true,
      select: "-password -refreshToken -createdAt -updatedAt",
    }
  );

  res.json(updatedUser);
});

// * exports
export { register, login, logout, getCurrentUser, update };
