import { Schema, Document, model } from "mongoose";
import { handleMongooseError } from "../helpers";

const emailRegexp: RegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const phoneRegexp: RegExp = /^(\d{2})\s\((\d{3})\)\s(\d{3})\s(\d{2})\s(\d{2})$/;
const skypeNumberRegexp: RegExp = /^\+[1-9]\d{0,2}[.-]?\d{1,14}$/;
const birthdayRegexp: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  skype?: string;
  birthday?: string;
  refreshToken: string;
  avatarURL: string;
  avatarID: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 35,
      required: [true, "Set name for account"],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },

    phone: {
      type: String,
      match: phoneRegexp,
      default: "",
    },

    skype: {
      type: String,
      match: skypeNumberRegexp,
      default: "",
    },

    birthday: {
      type: String,
      match: birthdayRegexp,
      default: "",
    },

    refreshToken: {
      type: String,
      default: "",
    },

    avatarURL: {
      type: String,
      default: "",
    },

    avatarID: {
      type: String,
      default: "",
    },
  },

  { versionKey: false, timestamps: true }
);

userSchema.post<IUser>("save", handleMongooseError);

const UserModel = model<IUser>("user", userSchema);

export default UserModel;
