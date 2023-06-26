import { Request, Response } from "express";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import fs from "fs/promises";
import {
  HttpError,
  assignTokens,
  controllerWrapper,
  cloudinaryAPI,
  handleAvatar,
} from "../helpers";
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
    phone: "",
    skype: "",
    birthday: "",
  });

  const { accessToken, refreshToken } = assignTokens(newUser);
  await UserModel.findByIdAndUpdate(newUser._id, { refreshToken });

  res.status(201).json({
    accessToken,
    user: {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      skype: newUser.skype,
      birthday: newUser.birthday,
      avatarURL: newUser.avatarURL,
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
      phone: user.phone,
      skype: user.skype,
      birthday: user.birthday,
      avatarURL: user.avatarURL,
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
  const { email, name, phone, skype, birthday, avatarURL } = req.user;
  res.json({ email, name, phone, skype, birthday, avatarURL });
});

//* PATCH /update
const update = controllerWrapper(async (req: any, res: Response) => {
  const { _id, avatarID, avatarURL, email } = req.user;
  const { email: newEmail } = req.body;

  const existedUser = await UserModel.findOne({ newEmail });
  if (existedUser && email !== newEmail) {
    throw new HttpError(409, `Email "${newEmail}" already exists`);
  }
  let newAvatarURL = avatarURL;
  let newAvatarID = avatarID;

  if (req.file) {
    const { path: tempUpload } = req.file;

    await handleAvatar(tempUpload);

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
      select: "-password -refreshToken -createdAt -updatedAt -avatarID",
    }
  );

  res.json(updatedUser);
});

//* PATCH /changePassword
const changePassword = controllerWrapper(async (req: any, res: Response) => {
  const { _id } = req.user;
  const { password, newPassword } = req.body;

  const user = await UserModel.findById(_id);
  if (!user) {
    throw new HttpError(401, `User not found`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, `Password invalid`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserModel.findByIdAndUpdate(_id, {
    password: hashedPassword,
  });

  res.json({ message: "password changed successfully" });
});

// * Google Auth

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
export {
  register,
  login,
  logout,
  getCurrentUser,
  update,
  changePassword,
  googleAuth,
};
