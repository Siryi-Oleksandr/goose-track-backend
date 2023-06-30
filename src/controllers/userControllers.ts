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
  // ACCESS_TOKEN_SECRET_KEY = "",
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

interface IUser {
  userId: string;
  userName: string;
  userEmail: string;
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
  await UserModel.findByIdAndUpdate(newUser._id, { accessToken, refreshToken });

  res.status(201).json({
    accessToken,
    refreshToken,
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
  await UserModel.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
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

//* POST /refresh
const refresh = controllerWrapper(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  try {
    const { userId, userName, userEmail } = jwt.verify(
      token,
      REFRESH_TOKEN_SECRET_KEY
    ) as IUser;

    const isExist = await UserModel.findOne({ refreshToken: token });

    if (!isExist) {
      throw new HttpError(403, "Refresh token invalid");
    }

    const { accessToken, refreshToken } = assignTokens({
      _id: userId,
      name: userName,
      email: userEmail,
    });

    await UserModel.findByIdAndUpdate(userId, {
      accessToken,
      refreshToken,
    });

    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    throw new HttpError(403, error.message);
  }
});

//* POST /logout
const logout = controllerWrapper(async (req: any, res: Response) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { refreshToken: "", accessToken: "" });

  res.status(200).json({ message: "logout successfull" });
});

//* GET /current
const getCurrentUser = controllerWrapper(async (req: any, res: Response) => {
  const { email, name, phone, skype, birthday, avatarURL, accessToken } =
    req.user;
  res.json({
    accessToken,
    user: { email, name, phone, skype, birthday, avatarURL },
  });
});

//* PATCH /update
const update = controllerWrapper(async (req: any, res: Response) => {
  const { _id, avatarID, avatarURL, email } = req.user;
  const { email: newEmail } = req.body;

  const existedUser = await UserModel.findOne({ email: newEmail });

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
      select:
        "-password -accessToken -refreshToken -avatarID -createdAt -updatedAt ",
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
  const { _id } = req.user;

  // const payload: {
  //   _id: string;
  // } = { _id };

  const { accessToken, refreshToken } = assignTokens(req.user);

  await UserModel.findByIdAndUpdate(_id, { accessToken, refreshToken });

  res.redirect(
    `${FRONTEND_URL}?accessToken=${accessToken}&refreshToken${refreshToken}`
  );
};

// * exports
export {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  update,
  changePassword,
  googleAuth,
};
