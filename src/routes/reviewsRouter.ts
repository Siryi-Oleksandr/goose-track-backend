import express from "express";
import {
  getReviews,
  addReview,
  getOwnReview,
  updateReview,
  removeReview,
} from "../controllers/reviewsControllers";
import { isValidId, isValidBody } from "../middlewares";
import { joiReviewsSchema } from "helpers";

const router = express.Router();
router.get("/", getReviews);
router.get("/own", isValidId, getOwnReview);
router.post("/own", isValidBody(joiReviewsSchema), addReview);
router.patch("/own", isValidId, isValidBody(joiReviewsSchema), updateReview);
router.delete("/own", isValidId, removeReview);

export default router;
