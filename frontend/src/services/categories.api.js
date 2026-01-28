import api from "./api";
import { fetchWrapper } from "./fetchWrapper";

async function createCategory({ name, slug, description }) {
  return fetchWrapper(async () => {
    const res = await api.post("/categories/create-category", {
      name,
      slug,
      description,
    });
    return res.data.data;
  });
}

async function updateCategory(categoryId, payload) {
  if (!categoryId) throw new Error("categoryId is required");
  return fetchWrapper(async () => {
    const res = await api.put(
      `/categories/${categoryId}/update-category`,
      payload
    );
    return res.data.data;
  });
}

async function deleteCategory(categoryId) {
  if (!categoryId) throw new Error("categoryId is required");
  return fetchWrapper(async () => {
    const res = await api.delete(`/categories/${categoryId}/delete-category`);
    return res.data.data;
  });
}

async function toggleCategoryStatus(categoryId) {
  if (!categoryId) throw new Error("categoryId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(
      `/categories/${categoryId}/toggle-category-status`
    );
    return res.data.data;
  });
}

async function getActiveCategories() {
  return fetchWrapper(async () => {
    const res = await api.get("/categories/get-active-categories");
    return res.data.data;
  });
}

export {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getActiveCategories,
};
