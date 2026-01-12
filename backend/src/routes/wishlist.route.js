import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-wishlist", verifyJWT, getMyWishlist);

router.post("/:productId/add-to-wishlist", verifyJWT, addToWishlist);

router.delete(
  "/:productId/remove-from-wishlist",
  verifyJWT,
  removeFromWishlist
);

router.delete("/clear-wishlist", verifyJWT, clearWishlist);

export default router;
