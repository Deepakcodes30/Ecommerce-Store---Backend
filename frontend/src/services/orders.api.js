import api from "./api";
import { fetchWrapper } from "./fetchWrapper.js";

async function createOrder({ orderItems, shippingAddress, paymentMethod }) {
  if (!orderItems?.length) throw new Error("orderItems are required");
  if (!shippingAddress) throw new Error("shippingAddress is required");
  if (!paymentMethod) throw new Error("paymentMethod is required");
  return fetchWrapper(async () => {
    const res = await api.post("/orders/create-order", {
      orderItems,
      shippingAddress,
      paymentMethod,
    });
    return res.data.data;
  });
}

async function getOrderById(orderId) {
  if (!orderId) throw new Error("orderId is required");
  return fetchWrapper(async () => {
    const res = await api.get(`/orders/${orderId}/get-order-by-id`);
    return res.data.data;
  });
}

async function getMyOrders() {
  return fetchWrapper(async () => {
    const res = await api.get("/orders/get-my-orders");
    return res.data.data;
  });
}

async function cancelOrder(orderId) {
  if (!orderId) throw new Error("orderId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(`/orders/${orderId}/cancel-order`);
    return res.data.data;
  });
}

async function getAllOrders() {
  return fetchWrapper(async () => {
    const res = await api.get("/orders/get-all-orders");
    return res.data.data;
  });
}

async function updateOrderStatus(orderId, status) {
  if (!orderId) throw new Error("orderId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(
      `/orders/${orderId}/update-order-status`,
      status
    );
    return res.data.data;
  });
}

async function markedAsDelivered(orderId) {
  if (!orderId) throw new Error("orderId is required");
  return fetchWrapper(async () => {
    const res = await api.patch(`/orders/${orderId}/marked-as-delivered`);
    return res.data.data;
  });
}

export {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  markedAsDelivered,
};
