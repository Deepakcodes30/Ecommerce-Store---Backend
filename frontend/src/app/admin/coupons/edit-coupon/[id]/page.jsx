"use client";

import { useEffect, useState } from "react";
import { updateCoupon, getAllCoupons } from "@/services/coupons.api.js";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function page() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getAllCoupons().then((coupons) => {
      setForm(coupons.find((c) => c._id === id));
    });
  }, [id]);

  if (!form) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCoupon(id, form);
    alert("Coupon updated");
    router.push("/admin/coupons/all-coupons");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Coupon</h2>

      <input value={form.code} disabled />

      <input
        type="number"
        value={form.discountValue}
        onChange={(e) =>
          setForm({ ...form, discountValue: Number(e.target.value) })
        }
      />

      <button type="submit">Update</button>
    </form>
  );
}
