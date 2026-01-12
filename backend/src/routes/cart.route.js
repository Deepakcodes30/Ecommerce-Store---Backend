import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/get-cart", getCart);
router.post("/add-to-cart", addToCart);
router.put("/update-cart-item", updateCartItem);
router.delete("/remove-cart-item//:itemId", removeCartItem);
router.delete("/clear-cart", clearCart);

export default router;
