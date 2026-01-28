import api from "./api";
import { fetchWrapper } from "./fetchWrapper";

async function addToWishlist(productId) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.post(`/wishlists/${productId}/add-to-wishlist`);
    return res.data;
  });
}

async function removeFromWishlist(productId) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.delete(
      `/wishlists/${productId}/remove-from-wishlist`
    );
    return res.data;
  });
}

async function getMyWishlist() {
  return fetchWrapper(async () => {
    const res = await api.get("/wishlists/get-my-wishlist");
    return res.data;
  });
}

async function clearWishlist() {
  return fetchWrapper(async () => {
    const res = await api.delete("/wishlists/clear-wishlist");
    return res.data;
  });
}

export { addToWishlist, removeFromWishlist, getMyWishlist, clearWishlist };
