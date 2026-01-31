"use client";

import { useEffect, useState } from "react";
import {
  getAllCoupons,
  toggleCouponStatus,
  deleteCoupon,
} from "@/services/coupons.api.js";
import { useRouter } from "next/navigation";

export default function Page() {
  const [coupons, setCoupons] = useState([]);
  const router = useRouter();

  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons();
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId) => {
    try {
      await deleteCoupon(couponId);
      await fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleToggle = async (couponId) => {
    try {
      await toggleCouponStatus(couponId);
      await fetchCoupons();
    } catch (error) {
      console.error("Error toggling coupon:", error);
    }
  };

  return (
    <>
      <h2>All Coupons</h2>

      {coupons.map((coupon) => (
        <div key={coupon._id}>
          <b>{coupon.code}</b> ({coupon.discountType})
          <button
            onClick={() =>
              router.push(`/admin/coupons/edit-coupon/${coupon._id}`)
            }>
            Edit
          </button>
          <button onClick={() => handleDelete(coupon._id)}>Delete</button>
          <button onClick={() => handleToggle(coupon._id)}>Toggle</button>
        </div>
      ))}
    </>
  );
}
