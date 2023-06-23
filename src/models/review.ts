import { Schema, Document, model } from "mongoose";
import { handleMongooseError } from "../helpers";

interface IReview extends Document {
  name: string;
  avatar: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  refreshToken: string;
  date: string;
  owner: Schema.Types.ObjectId;
}

const reviewsSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    text: {
      type: String,
      minlength: 3,
      maxlength: 3000,
      required: [true, "Write text for your review"],
    },
    date: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "09-00",
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

reviewsSchema.post<IReview>("save", handleMongooseError);

const ReviewsModel = model<IReview>("review", reviewsSchema);

export default ReviewsModel;
