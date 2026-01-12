import { Router } from "express";
import {
  addReview,
  deleteReview,
  getProductReviews,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/:productId/get-product-reviews", getProductReviews);

// User
router.post(
  "/:productId/add-review",
  verifyJWT,
  upload.fields([{ name: "images", maxCount: 5 }]),
  addReview
);

router.delete("/:reviewId/delete-review", verifyJWT, deleteReview);

export default router;
