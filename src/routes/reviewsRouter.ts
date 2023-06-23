import express from "express";
import {
  getReviews,
  addReview,
  getOwnReview,
  updateReview,
  removeReview,
} from "../controllers/reviewsControllers";
import { isValidId, isValidBody, authenticate } from "../middlewares";
import { joiReviewsSchema } from "../helpers";

const router = express.Router();
router.get("/", getReviews);
router.get("/own", authenticate, isValidId, getOwnReview);
router.post("/own", authenticate, isValidBody(joiReviewsSchema), addReview);
router.patch(
  "/own",
  authenticate,
  isValidId,
  isValidBody(joiReviewsSchema),
  updateReview
);
router.delete("/own", authenticate, isValidId, removeReview);

export default router;
