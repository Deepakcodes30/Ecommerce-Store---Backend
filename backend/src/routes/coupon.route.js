import { Router } from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getAllCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/validate", validateCoupon);
router.post("/create-coupon", verifyJWT, isAdmin, createCoupon);
router.get("/get-all-coupons", verifyJWT, isAdmin, getAllCoupons);
router.put("/:couponId/update-coupon", verifyJWT, isAdmin, updateCoupon);
router.delete("/:couponId/delete-coupon", verifyJWT, isAdmin, deleteCoupon);
router.patch(
  "/:couponId/toggle-coupon-status",
  verifyJWT,
  isAdmin,
  toggleCouponStatus
);

export default router;
