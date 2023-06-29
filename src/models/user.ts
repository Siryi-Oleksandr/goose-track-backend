import { Schema, Document, model } from "mongoose";
import { handleMongooseError } from "../helpers";

const emailRegexp: RegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  skype?: string;
  birthday?: string;
  avatarURL?: string;
  avatarID?: string;
  refreshToken: string;
  accessToken: string;
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
      default: "",
    },

    skype: {
      type: String,
      default: "",
    },

    birthday: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
      default: "",
    },

    accessToken: {
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
