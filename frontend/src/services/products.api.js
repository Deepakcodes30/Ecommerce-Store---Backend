import api from "./api";

async function createProduct(formData) {
  return fetchWrapper(async () => {
    const res = await api.post("/products/create-product", formData);
    return res.data;
  });
}

async function updateProduct(productId, formData) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.put(
      `/products/${productId}/update-product`,
      formData
    );
    return res.data;
  });
}

async function deleteProduct(productId) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.delete(`/products/${productId}/delete-product`);
    return res.data;
  });
}

async function updateProductStock(productId, stock) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(`/products/${productId}/update-product-stock`, {
      stock,
    });
    return res.data;
  });
}

async function toggleProductStatus(productId) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(`/products/${productId}/toggle-product-status`);
    return res.data;
  });
}

async function getAllProducts() {
  return fetchWrapper(async () => {
    const res = await api.get("/products/get-all-products");
    return res.data;
  });
}

async function getProductBySlug(slug) {
  if (!slug) throw new Error("Slug is required");
  return fetchWrapper(async () => {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  });
}

export const productServices = {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
  getAllProducts,
  getProductBySlug,
};
