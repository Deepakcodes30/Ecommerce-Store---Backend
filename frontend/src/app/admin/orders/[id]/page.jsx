"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getOrderById,
  updateOrderStatus,
  markedAsDelivered,
  cancelOrder,
} from "@/services/orders.api.js";

function page() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ---------------- ADMIN ACTIONS ---------------- */

  const handleStatusUpdate = async (status) => {
    try {
      setActionLoading(true);
      await updateOrderStatus(id, { status });
      await fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      setActionLoading(true);
      await markedAsDelivered(id);
      await fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirm) return;

    try {
      setActionLoading(true);
      await cancelOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (loading) return <p className="p-6">Loading order...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!order) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <button
          onClick={() => router.back()}
          className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
          Back
        </button>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold mb-2">Order Summary</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            Order ID: <span className="font-medium">{order._id}</span>
          </p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>
            Status:{" "}
            <span className="font-medium capitalize">{order.orderStatus}</span>
          </p>
          <p>
            Payment: <span className="capitalize">{order.paymentMethod}</span>
          </p>
          <p>
            Total Amount:{" "}
            <span className="font-semibold">₹{order.totalAmount}</span>
          </p>
          <p>Delivered: {order.isDelivered ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Customer & Address */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Customer</h2>
          <p className="text-sm">{order.user?.fullName}</p>
          <p className="text-sm">{order.user?.email}</p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p className="text-sm">
            {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
          <p className="text-sm">Phone: {order.shippingAddress?.phoneNumber}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-4">Order Items</h2>

        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center text-sm border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Actions */}
      <div className="border rounded-lg p-4 bg-white space-y-4">
        <h2 className="font-semibold">Admin Actions</h2>

        <div className="flex flex-wrap gap-3">
          <select
            disabled={actionLoading}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="border px-3 py-2 rounded"
            defaultValue="">
            <option value="" disabled>
              Update Status
            </option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {!order.isDelivered && (
            <button
              onClick={handleMarkDelivered}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Mark as Delivered
            </button>
          )}

          {order.orderStatus !== "cancelled" && (
            <button
              onClick={handleCancelOrder}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
