import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name) {
    throw new apiError(400, "Please enter a name of the category");
  }

  const category = await Category.create({
    name,
    slug,
    description,
  });

  if (!category) {
    throw new apiError(500, "Something went wrong, please try again later");
  }

  return res
    .status(200)
    .json(new apiResponse(200, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  const { categoryId } = req.params;

  if (!name) {
    throw new apiError(400, "Please enter a name of the category");
  }
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new apiError(400, "Invalid Category ID");
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        name: name,
        slug: slug,
        description: description,
      },
    },
    {
      new: true,
    }
  );

  if (!category) {
    throw new apiError(500, "Something went wrong, please try again later");
  }
  return res
    .status(200)
    .json(new apiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new apiError(400, "Please enter a name of the category");
  }

  await Category.findByIdAndDelete(categoryId);

  return res
    .status(200)
    .json(new apiResponse(200, "Category deleted successfully"));
});

const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new apiError(400, "Please enter a name of the category");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new apiError(500, "Something went wrong, please try again later");
  }

  category.isActive = !category.isActive;

  const updatedCategory = await category.save({ validateBeforeSave: false });

  if (!updatedCategory) {
    throw new apiError(500, "Something went wrong, please try again later");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedCategory, "Category updated successfully")
    );
});

const getActiveCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });

  if (!categories.length) {
    return new apiError(400, "There are no Categories");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, categories, "All categories fetched successfully")
    );
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getActiveCategories,
};
