"use client";

import { useState } from "react";
import { createCategory } from "../../../../services/categories.api";
import { useRouter } from "next/navigation";

export default function name() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCategory(form);
    alert("Category created");
    router.push("/admin/categories/all-categories");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Category</h2>

      <input
        placeholder="Category Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button type="submit">Create</button>
    </form>
  );
}
