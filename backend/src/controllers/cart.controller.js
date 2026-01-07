import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title slug"
  ); //using populate to extract product details directly without using aggregate pipelines - easy and clean

  if (!cart) {
    return res
      .status(200)
      .json(new apiResponse(200, { items: [] }, "Cart is empty"));
  }

  return res.status(200).json(new apiResponse(200, cart, "Cart fetched"));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  if (!productId) {
    throw new apiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new apiError(404, "Product not available");
  }

  const price = product.discountedPrice || product.mrp;
  const image = product.images?.[0];

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && item.variant === variant
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      variant,
      price,
      image,
    });
  }

  // calculations simple
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  cart.totalCartValue = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  await cart.save();

  return res.status(200).json(new apiResponse(200, cart, "Item added to cart"));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (quantity < 1) {
    throw new apiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new apiError(404, "Cart item not found");
  }

  item.quantity = quantity;

  /*this is the reduce function syntax for my reference  
  array.reduce((accumulator, currentItem) => {
    return newAccumulatorValue;
  }, initialValue);*/

  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  cart.totalCartValue = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  await cart.save();

  return res.status(200).json(new apiResponse(200, cart, "Cart updated"));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  cart.totalCartValue = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new apiResponse(200, cart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalCartValue = 0;

  await cart.save();

  return res.status(200).json(new apiResponse(200, null, "Cart cleared"));
});

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
