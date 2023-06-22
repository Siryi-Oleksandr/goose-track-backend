import { Schema, Document, model } from "mongoose";
import { handleMongooseError } from "../helpers";

interface ITask extends Document {
  title: string;
  start: string;
  end: string;
  priority: "low" | "medium" | "high";
  date: string;
  category: "to-do" | "in-progress" | "done";
  owner: Schema.Types.ObjectId;
}

// "валідація форми:
// title: макс 250 сиволів | обов'язково
// start: формат 09:00 | обов'язково
// end: формат 09:30 | end > start | обов'язково
// priority: [low | medium | high] | обов'язково
// date: формат YYYY-MM-DD | обов'язково
// category: [to-do | in-progress | done] | обов'язково"

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
      default: "09-00",
    },
    end: {
      type: String,
      default: "09-30",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Set priority for your task"],
    },
    date: {
      type: String,
      required: [true, "Set date for your task"],
    },
    category: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
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
