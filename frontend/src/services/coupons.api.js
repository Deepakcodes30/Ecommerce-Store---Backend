import api from "./api";

async function createCoupon({
  code,
  discountType,
  discountValue,
  minOrderValue,
  expiresAt,
}) {
  return fetchWrapper(async () => {
    const res = await api.post("/coupons/create-coupon", {
      code,
      discountType,
      discountValue,
      minOrderValue,
      expiresAt,
    });
    return res.data.data;
  });
}

async function updateCoupon(couponId, payload) {
  if (!couponId) throw new Error("couponId is required");

  return fetchWrapper(async () => {
    const res = await api.put(`/coupons/${couponId}/update-coupon`, payload);
    return res.data.data;
  });
}

async function deleteCoupon(couponId) {
  if (!couponId) throw new Error("couponId is required");
  return fetchWrapper(async () => {
    const res = await api.delete(`/coupons/${couponId}/delete-coupon`);
    return res.data.data;
  });
}

async function toggleCouponStatus(couponId) {
  if (!couponId) throw new Error("couponId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(`/coupons/${couponId}/toggle-coupon-status`);
    return res.data.data;
  });
}

async function getAllCoupons() {
  return fetchWrapper(async () => {
    const res = await api.get("/coupons/get-all-coupons");
    return res.data.data;
  });
}

async function validateCoupon({ code, orderValue }) {
  if (!code) throw new Error("coupon code is required");
  return fetchWrapper(async () => {
    const res = await api.post("/coupons/validate-coupon", {
      code,
      orderValue,
    });
    return res.data.data;
  });
}

export {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getAllCoupons,
  validateCoupon,
};
