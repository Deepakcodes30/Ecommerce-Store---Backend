import api from "./api";
import { fetchWrapper } from "./fetchWrapper";

async function addReview({ productId, rating, comment }) {
  if (!productId) throw new Error("productId is required");
  if (!rating) throw new Error("rating is required");
  return fetchWrapper(async () => {
    const res = await api.post(`/reviews/${productId}/add-review`, {
      rating,
      comment,
    });
    return res.data;
  });
}

async function deleteReview(reviewId) {
  if (!reviewId) throw new Error("reviewId is required");
  return fetchWrapper(async () => {
    const res = await api.delete(`/reviews/${reviewId}/delete-review`);
    return res.data;
  });
}

async function getProductReviews(productId) {
  if (!productId) throw new Error("productId is required");
  return fetchWrapper(async () => {
    const res = await api.get(`/reviews/${productId}/get-product-reviews`);
    return res.data;
  });
}

export const reviewServices = { addReview, deleteReview, getProductReviews };
