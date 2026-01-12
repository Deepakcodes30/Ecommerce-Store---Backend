import { Router } from "express";
import {
  createAddress,
  getAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create-address", createAddress);
router.get("/get-user-addresses", getUserAddresses);
router.get("/:addressId/get-address", getAddress);
router.put("/:addressId/update-address", updateAddress);
router.delete("/:addressId/delete-address", deleteAddress);

export default router;
