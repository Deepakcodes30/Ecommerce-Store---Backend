"use client";

import { useState } from "react";
import { createCoupon } from "../../../../services/coupons.api.js";
import { useRouter } from "next/navigation";

export default function page() {
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderValue: "",
    expiresAt: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCoupon(form);
    alert("Coupon created");
    router.push("/admin/coupons/all-coupons");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Coupon</h2>

      <input
        placeholder="CODE"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <select
        value={form.discountType}
        onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
        <option value="PERCENT">Percent</option>
        <option value="FLAT">Flat</option>
      </select>

      <input
        type="number"
        placeholder="Discount Value"
        value={form.discountValue}
        onChange={(e) =>
          setForm({ ...form, discountValue: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Min Order Value"
        value={form.minOrderValue}
        onChange={(e) =>
          setForm({ ...form, minOrderValue: Number(e.target.value) })
        }
      />

      <input
        type="date"
        value={form.expiresAt}
        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
      />

      <button type="submit">Create</button>
    </form>
  );
}
