"use client";

function OrderCard({ order, onView }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold">
          Order ID: <span className="text-gray-600">{order._id}</span>
        </p>

        <span
          className={`text-xs px-2 py-1 rounded font-medium
            ${
              order.orderStatus === "pending" && "bg-yellow-100 text-yellow-700"
            }
            ${order.orderStatus === "shipped" && "bg-blue-100 text-blue-700"}
            ${
              order.orderStatus === "delivered" && "bg-green-100 text-green-700"
            }
            ${order.orderStatus === "cancelled" && "bg-red-100 text-red-700"}
          `}>
          {order.orderStatus}
        </span>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          Customer:{" "}
          <span className="font-medium">{order.user?.fullName || "N/A"}</span>
        </p>

        <p>
          Payment:{" "}
          <span className="capitalize font-medium">{order.paymentMethod}</span>
        </p>

        <p>
          Amount: <span className="font-semibold">₹{order.totalAmount}</span>
        </p>

        <p className="text-xs text-gray-500">
          Ordered on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onView(order._id)}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
          View Details
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
