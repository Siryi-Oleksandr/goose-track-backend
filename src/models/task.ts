import { Schema, Document, model } from "mongoose";
import { handleMongooseError } from "../helpers";

const dateRegexp: RegExp =
  /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/;
const timeRegexp: RegExp = /^([01]\d|2[0-3]):[0-5]\d$/;
const categoryType = ["to-do", "in-progress", "done"];
const priorityType = ["low", "medium", "high"];

interface ITask extends Document {
  title: string;
  start: string;
  end: string;
  priority: "low" | "medium" | "high";
  date: string;
  category: "to-do" | "in-progress" | "done";
  owner: Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 250,
      required: [true, "Set title for your task"],
    },
    start: {
      type: String,
      match: timeRegexp,
      default: "09-00",
    },
    end: {
      type: String,
      match: timeRegexp,
      default: "09-30",
    },
    priority: {
      type: String,
      enum: priorityType,
      required: [true, "Set priority for your task"],
    },
    date: {
      type: String,
      match: dateRegexp,
      required: [true, "Set date for your task"],
    },
    category: {
      type: String,
      enum: categoryType,
      required: [true, "Set category for your task"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post<ITask>("save", handleMongooseError);

const TaskModel = model<ITask>("task", taskSchema);

export default TaskModel;
