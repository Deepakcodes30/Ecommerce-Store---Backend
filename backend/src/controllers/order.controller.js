import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems?.length || !shippingAddress || !paymentMethod) {
    throw new apiError(400, "Missing order data");
  }

  const productIds = orderItems.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  let itemsPrice = 0;

  const finalOrderItems = orderItems.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);

    if (!product) throw new apiError(400, "Invalid product");

    itemsPrice += product.discountedPrice * item.quantity;

    return {
      product: product._id,
      name: product.title,
      price: product.discountedPrice,
      quantity: item.quantity,
      image: product.images[0],
    };
  });

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: finalOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  return res
    .status(201)
    .json(new apiResponse(201, order, "Order placed successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new apiError(400, "Invalid order ID");
  }

  const order = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "shippingAddress",
        foreignField: "_id",
        as: "shippingAddress",
      },
    },
    { $unwind: "$shippingAddress" },
  ]);

  if (!order.length) {
    throw new apiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order[0], "Order fetched successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new apiResponse(200, orders, "My orders fetched"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  if (["Shipped", "Delivered"].includes(order.orderStatus)) {
    throw new apiError(400, "Order cannot be cancelled");
  }

  order.orderStatus = "Cancelled";
  await order.save();

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order cancelled successfully"));
});

//for admin purposes

const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const pipeline = [
    { $sort: { [sort]: sortOrder } },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { fullName: 1, email: 1 } }],
      },
    },
    { $unwind: "$user" },
  ];

  const [orders, totalOrders] = await Promise.all([
    Order.aggregate(pipeline),
    Order.countDocuments(),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        orders,
        pagination: {
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit),
          currentPage: Number(page),
        },
      },
      "All orders fetched"
    )
  );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatus = [
    "Confirmed",
    "Shipped",
    "In Transit",
    "Out for Delivery",
  ];

  if (!allowedStatus.includes(status)) {
    throw new apiError(400, "Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { orderStatus: status } },
    { new: true }
  );

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order status updated"));
});

const markedAsDelivered = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        orderStatus: "Delivered",
        isPaid: true,
        paidAt: new Date(),
        deliveredAt: new Date(),
        paymentStatus: "Paid",
      },
    },
    { new: true }
  );

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order marked as delivered"));
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  markedAsDelivered,
};
