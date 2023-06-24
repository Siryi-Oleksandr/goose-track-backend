import express from "express";
import {
  getReviews,
  addReview,
  getOwnReview,
  updateReview,
  removeReview,
} from "../controllers/reviewsControllers";
import { isValidBody, authenticate } from "../middlewares";
import { joiReviewsSchema } from "../helpers";

const router = express.Router();
router.get("/", getReviews);
router.get("/own", authenticate, getOwnReview);
router.post("/own", authenticate, isValidBody(joiReviewsSchema), addReview);
router.patch("/own", authenticate, isValidBody(joiReviewsSchema), updateReview);
router.delete("/own", authenticate, removeReview);

export default router;
