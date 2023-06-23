import { Response, Request } from "express";
import { controllerWrapper, HttpError } from "../helpers";
import ReviewModel from "../models/review";

// ******************* API:  /Reviews  ******************

//* GET /reviews
const getReviews = controllerWrapper(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query as {
    page?: number;
    limit?: number;
  };
  const skip = (page - 1) * limit;
  const reviews = await ReviewModel.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name avatarURL");
  res.json(reviews);
});

//* GET /reviews/own

const getOwnReview = controllerWrapper(async (req: Request, res: Response) => {
  const { own } = req.params;
  const result = await ReviewModel.findById(own);

  if (!result) {
    throw new HttpError(404, `Review with "${own}" not found`);
  }

  res.json(result);
});

//* POST /reviews/own

const addReview = controllerWrapper(async (req: any, res: Response) => {
  const { _id: owner } = req.user;

  console.log(owner);

  if (!owner) {
    throw new HttpError(404, "Review not found");
  }

  const review = await ReviewModel.create({
    ...req.body,
    date: new Date(),
    owner,
  });

  res.status(201).json(review);
});

//* PATCH /reviews/own
const updateReview = controllerWrapper(async (req: Request, res: Response) => {
  const { own } = req.params;

  const review = await ReviewModel.findByIdAndUpdate(own, req.body, {
    new: true,
  });

  if (!review) {
    throw new HttpError(404, `Review with ${own} not found`);
  }

  res.json(review);
});

//* DELETE /reviews/own
const removeReview = controllerWrapper(async (req: Request, res: Response) => {
  const { own } = req.params;
  const removedReview = await ReviewModel.findByIdAndRemove(own);
  if (!removedReview) {
    throw new HttpError(404, `Review with "${own}" not found`);
  }
  res.json({ message: "Review deleted" });
});

export { getReviews, addReview, getOwnReview, updateReview, removeReview };
