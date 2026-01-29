"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";
import { getAllOrders } from "@/services/orders.api.js";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded">
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onView={(id) => router.push(`/admin/orders/${id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders found.</p>
      )}
    </div>
  );
}

export default page;
