import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getActiveCategories,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.get("/get-active-categories", getActiveCategories);

router.post("/create-category", verifyJWT, isAdmin, createCategory);
router.put("/:categoryId/update-category", verifyJWT, isAdmin, updateCategory);
router.delete(
  "/:categoryId/delete-category",
  verifyJWT,
  isAdmin,
  deleteCategory
);
router.patch(
  "/:categoryId/toggle-category-status",
  verifyJWT,
  isAdmin,
  toggleCategoryStatus
);

export default router;
