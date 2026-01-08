import mongoose from "mongoose";
import { Coupon } from "../models/coupon.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, expiresAt } =
    req.body;

  if (!code || !discountType || !discountValue) {
    throw new apiError(400, "Required fields are missing");
  }

  const existingCoupon = await Coupon.findOne({ code });

  if (existingCoupon) {
    throw new apiError(400, "Coupon already exists");
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderValue,
    expiresAt,
    isActive: true,
  });

  return res
    .status(201)
    .json(new apiResponse(201, coupon, "Coupon created successfully"));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new apiError(400, "Invalid coupon ID");
  }

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new apiError(404, "Coupon not found");
  }

  coupon.set(req.body); // clean & simple
  await coupon.save();

  return res
    .status(200)
    .json(new apiResponse(200, coupon, "Coupon updated successfully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new apiError(400, "Invalid coupon ID");
  }

  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new apiError(404, "Coupon not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Coupon deleted successfully"));
});

const toggleCouponStatus = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new apiError(404, "Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, coupon, "Coupon status updated"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, coupons, "Coupons fetched successfully"));
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;

  if (!code || !orderValue) {
    throw new apiError(400, "Coupon code and order value are required");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new apiError(400, "Invalid or inactive coupon");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new apiError(400, "Coupon has expired");
  }

  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    throw new apiError(400, `Minimum order value is ₹${coupon.minOrderValue}`);
  }

  let discountAmount = 0;

  if (coupon.discountType === "PERCENT") {
    discountAmount = (orderValue * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        coupon: coupon.code,
        discountAmount,
        finalAmount: Math.max(orderValue - discountAmount, 0),
      },
      "Coupon applied successfully"
    )
  );
});

export {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getAllCoupons,
  validateCoupon,
};
