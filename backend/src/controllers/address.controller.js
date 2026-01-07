import mongoose from "mongoose";
import { Address } from "../models/address.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    line1,
    line2,
    city,
    state,
    pincode,
    addressType,
    isDefault,
  } = req.body;

  if (!fullName || !phoneNumber || !line1 || !city || !state || !pincode) {
    throw new apiError(400, "All required fields must be filled");
  }

  // If new address is default → unset existing default
  if (isDefault) {
    await Address.findByIdAndUpdate(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    user: req.user._id,
    fullName,
    phoneNumber,
    email,
    line1,
    line2,
    city,
    state,
    pincode,
    addressType,
    isDefault,
  });

  return res
    .status(201)
    .json(new apiResponse(201, address, "Address created successfully"));
});

const getAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new apiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });

  if (!address) {
    throw new apiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, address, "Address fetched successfully"));
});

const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new apiResponse(200, addresses, "User addresses fetched successfully")
    );
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const {
    fullName,
    phoneNumber,
    email,
    line1,
    line2,
    city,
    state,
    pincode,
    addressType,
    isDefault,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new apiError(400, "Invalid address ID");
  }

  if (!fullName || !phoneNumber || !line1 || !city || !state || !pincode) {
    throw new apiError(400, "All required fields must be filled");
  }

  const address = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });

  if (!address) {
    throw new apiError(404, "Address not found");
  }

  address.fullName = fullName;
  address.phoneNumber = phoneNumber;
  address.email = email;
  address.line1 = line1;
  address.line2 = line2;
  address.city = city;
  address.state = state;
  address.pincode = pincode;
  address.addressType = addressType;

  // Handle default address logic
  if (isDefault === true) {
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: addressId } },
      { $set: { isDefault: false } }
    );
    address.isDefault = true;
  }

  await address.save();

  return res
    .status(200)
    .json(new apiResponse(200, address, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new apiError(400, "Invalid address ID");
  }

  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: req.user._id,
  });

  if (!address) {
    throw new apiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Address deleted successfully"));
});

export {
  createAddress,
  getAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
};
