import api from "./api";

async function createProduct(formData) {
  const res = await api.post("/products/create-product", formData);
  return res.data;
}

async function updateProduct(productId, formData) {
  const res = await api.put(`/products/${productId}/update-product`, formData);
  return res.data;
}

async function deleteProduct(productId) {
  const res = await api.delete(`/products/${productId}/delete-product`);
  return res.data;
}

async function updateProductStock(productId, stock) {
  const res = await api.patch(`/products/${productId}/update-product-stock`, {
    stock,
  });
  return res.data;
}

async function toggleProductStatus(productId) {
  const res = await api.patch(`/products/${productId}/toggle-product-status`);

  return res.data;
}

async function getAllProducts() {
  const res = await api.get("/products/get-all-products");
  return res.data;
}

async function getProductBySlug(slug) {
  const res = await api.get(`/products/${slug}`);
  return res.data;
}

export {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
  getAllProducts,
  getProductBySlug,
};
