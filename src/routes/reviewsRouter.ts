import express from "express";
import {
  getReviews,
  addReview,
  getOwnReview,
  updateReview,
  removeReview,
} from "../controllers/reviewsControllers";
import { isValidBody, auth } from "../middlewares";
import { joiAPI } from "../helpers";

const router = express.Router();
router.get("/", getReviews);
router.get("/own", auth, getOwnReview);
router.post("/own", auth, isValidBody(joiAPI.reviewsSchema), addReview);
router.patch("/own", auth, isValidBody(joiAPI.reviewsSchema), updateReview);
router.delete("/own", auth, removeReview);

export default router;
