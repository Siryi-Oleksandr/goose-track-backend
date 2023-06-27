import express from "express";
import {
  getReviews,
  addReview,
  getOwnReview,
  updateReview,
  removeReview,
} from "../controllers/reviewsControllers";
import { isValidBody, authenticate } from "../middlewares";
import { joiAPI } from "../helpers";

const router = express.Router();
router.get("/", getReviews);
router.get("/own", authenticate, getOwnReview);
router.post("/own", authenticate, isValidBody(joiAPI.reviewsSchema), addReview);
router.patch(
  "/own",
  authenticate,
  isValidBody(joiAPI.reviewsSchema),
  updateReview
);
router.delete("/own", authenticate, removeReview);

export default router;
