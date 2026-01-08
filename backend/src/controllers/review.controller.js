import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  if (!rating) {
    throw new apiError(400, "Rating is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  // Upload images if provided
  let uploadedImages = [];
  if (req.files?.images?.length) {
    const uploads = await uploadOnCloudinary(req.files.images);
    uploadedImages = uploads.map((img) => ({
      url: img.url,
      public_id: img.public_id,
    }));
  }

  try {
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
      images: uploadedImages,
    });

    return res
      .status(201)
      .json(new apiResponse(201, review, "Review added successfully"));
  } catch (error) {
    if (error.code === 11000) {
      throw new apiError(400, "You have already reviewed this product");
    }
    throw error;
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new apiError(400, "Invalid review ID");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new apiError(404, "Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    throw new apiError(403, "Not authorized to delete this review");
  }

  // Delete images from cloudinary
  for (const img of review.images) {
    if (img.public_id) {
      await deleteFromCloudinary(img.public_id);
    }
  }

  await review.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Review deleted successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const reviews = await Review.find({
    product: productId,
    isApproved: true,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, reviews, "Reviews fetched successfully"));
});

export { addReview, deleteReview, getProductReviews };
