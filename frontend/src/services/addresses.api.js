import api from "./api.js";
import { fetchWrapper } from "./fetchWrapper.js";

async function createAddress({
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
}) {
  // now fetching using wrapper which includes try catch and error
  return fetchWrapper(async () => {
    const res = await api.post("/addresses/create-address", {
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
    return res.data;
  });
}

async function getAddress(addressId) {
  return fetchWrapper(async () => {
    const res = await api.get(`/addresses/${addressId}/get-address`);
    return res.data;
  });
}

async function getUserAddresses() {
  return fetchWrapper(async () => {
    const res = await api.get("/addresses/get-user-addresses");
    return res.data;
  });
}

async function updateAddress(addressId, payload) {
  if (!addressId) throw new Error("addressId is required");

  return fetchWrapper(async () => {
    const res = await api.put(
      `/addresses/${addressId}/update-address`,
      payload
    );
    return res.data;
  });
}

async function deleteAddress(addressId) {
  if (!addressId) throw new Error("addressId is required");

  return fetchWrapper(async () => {
    const res = await api.delete(`/addresses/${addressId}/delete-address`);
    return res.data;
  });
}

export const addressService = {
  createAddress,
  getAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
};
