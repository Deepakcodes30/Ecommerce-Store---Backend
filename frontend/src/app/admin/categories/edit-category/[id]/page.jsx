"use client";

import { useEffect, useState } from "react";
import { updateCategory, getActiveCategories } from "@/services/categories.api";
import { useParams } from "next/navigation";

export default function page() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    getActiveCategories().then((cats) => {
      const category = cats.find((c) => c._id === id);
      if (category) setForm(category);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCategory(id, form);
    alert("Updated");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Category</h2>

      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button>Update</button>
    </form>
  );
}
