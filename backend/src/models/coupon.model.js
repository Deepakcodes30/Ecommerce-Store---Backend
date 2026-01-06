import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
    },
    discountValue: {
      type: Number,
    },
    minOrderValue: {
      type: Number,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
