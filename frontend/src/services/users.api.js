import api from "./api";
import { fetchWrapper } from "./fetchWrapper";

async function registerUser(formData) {
  return fetchWrapper(async () => {
    const res = await api.post("/users/register-user", formData);
    return res.data.data;
  });
}

async function loginUser({ email, phoneNumber, password }) {
  return fetchWrapper(async () => {
    const res = await api.post("/users/login", {
      email,
      phoneNumber,
      password,
    });
    return res.data.data;
  });
}

async function logoutUser() {
  return fetchWrapper(async () => {
    const res = await api.post("/users/logout");
    return res.data.data;
  });
}

async function changeCurrentPassword({ oldPassword, newPassword }) {
  if (!oldPassword) throw new Error("Old password is required");
  if (!newPassword) throw new Error("New password is required");

  return fetchWrapper(async () => {
    const res = await api.post("/users/change-current-password", {
      oldPassword,
      newPassword,
    });
    return res.data.data;
  });
}

async function getCurrentUser() {
  return fetchWrapper(async () => {
    const res = await api.get("/users/get-current-user");
    return res.data.data;
  });
}

async function updateAccountDetails({ phoneNumber, email, fullName }) {
  return fetchWrapper(async () => {
    const res = await api.patch("/users/update-account-details", {
      phoneNumber,
      email,
      fullName,
    });
    return res.data.data;
  });
}

async function updateUserAvatar(formData) {
  return fetchWrapper(async () => {
    const res = await api.patch("/users/update-user-avatar", formData);
    return res.data.data;
  });
}

export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
