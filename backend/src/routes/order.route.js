import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  markedAsDelivered,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

// User
router.post("/create-order", verifyJWT, createOrder);
router.get("/get-my-orders", verifyJWT, getMyOrders);
router.get("/:orderId/get-order-by-id", verifyJWT, getOrderById);
router.patch("/:orderId/cancel-order", verifyJWT, cancelOrder);

// Admin
router.get("/get-all-orders", verifyJWT, isAdmin, getAllOrders);
router.patch(
  "/:orderId/update-order-status",
  verifyJWT,
  isAdmin,
  updateOrderStatus
);
router.patch(
  "/:orderId/mark-as-delivered",
  verifyJWT,
  isAdmin,
  markedAsDelivered
);

export default router;
