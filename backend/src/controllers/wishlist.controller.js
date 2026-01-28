import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      throw new apiError(400, "Product already in wishlist");
    }

    wishlist.products.push(productId);
    await wishlist.save();
  }

  return res
    .status(200)
    .json(new apiResponse(200, wishlist, "Added to wishlist"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new apiError(404, "Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();

  return res
    .status(200)
    .json(new apiResponse(200, wishlist, "Removed from wishlist"));
});

const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "title slug images discountedPrice"
  );
  if (!wishlist) {
    return res.status(200).json(new apiResponse(200, [], "Wishlist is empty"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, wishlist, "Wishlist fetched"));
});

const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new apiError(404, "Wishlist not found");
  }

  wishlist.products = [];
  await wishlist.save();

  return res
    .status(200)
    .json(new apiResponse(200, wishlist, "Wishlist cleared"));
});

export { addToWishlist, removeFromWishlist, getMyWishlist, clearWishlist };
