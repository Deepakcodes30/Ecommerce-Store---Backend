"use client";

import { useEffect, useState } from "react";
import {
  getActiveCategories,
  deleteCategory,
  toggleCategoryStatus,
} from "@/services/categories.api.js";
import { useRouter } from "next/navigation";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const data = await getActiveCategories();
      setCategories(data || []);
    } catch (error) {
      console.log("Error while Fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleCategoryStatus(id);
      await fetchCategories();
    } catch (error) {
      console.log("Error while toggling the status", error);
    }
  };

  return (
    <>
      <h2>All Categories</h2>

      {categories.map((category) => (
        <div key={category._id}>
          <b>{category.name}</b>
          <button
            onClick={() =>
              router.push(`/admin/categories/edit-category/${category._id}`)
            }>
            Edit
          </button>
          <button onClick={() => handleToggle(category._id)}>Toggle</button>
          <button onClick={() => handleDelete(category._id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
