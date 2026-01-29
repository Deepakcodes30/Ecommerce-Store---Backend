"use client";

import React, { useState, useEffect } from "react";
import {
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  getCurrentUser,
} from "../../services/users.api.js";
import { useForm } from "react-hook-form";
import Input from "../common/Input.jsx";

function UserProfile() {
  const [activeSelection, setActiveSelection] = useState(null);
  const [editedAvatar, setEditedAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        reset({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  const handleAvatarUpdate = async () => {
    if (!editedAvatar) return;

    try {
      setError(null);
      const formData = new FormData();
      formData.append("avatar", editedAvatar);

      const updatedUser = await updateUserAvatar(formData);
      setUser(updatedUser);
      setSuccessMessage("Avatar updated successfully!");
      setActiveSelection(null);
      setEditedAvatar(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message || "Failed to update avatar");
    }
  };

  const handleAccountUpdate = async (data) => {
    try {
      setError(null);
      const updatedUser = await updateAccountDetails({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
      });
      setUser(updatedUser);
      setSuccessMessage("Account details updated successfully!");
      setActiveSelection(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message || "Failed to update account details");
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      setError(null);
      await changeCurrentPassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setSuccessMessage("Password changed successfully!");
      setActiveSelection(null);
      reset();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {user.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {activeSelection === "avatar" ? (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditedAvatar(e.target.files[0])}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAvatarUpdate}
                disabled={!editedAvatar}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                Save
              </button>
              <button
                onClick={() => {
                  setActiveSelection(null);
                  setEditedAvatar(null);
                }}
                className="px-4 py-1 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setActiveSelection("avatar")}
            className="text-blue-600 hover:underline">
            Edit Avatar
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="space-y-1 text-gray-700">
        <p>
          <span className="font-medium">Full Name:</span> {user.fullName}
        </p>
        <p>
          <span className="font-medium">Phone Number:</span> {user.phoneNumber}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>

      {/* Change Password */}
      <div className="border-t pt-4">
        {activeSelection === "password" ? (
          <form
            onSubmit={handleSubmit(handlePasswordUpdate)}
            className="space-y-3">
            <Input
              label="Old Password"
              type="password"
              {...register("oldPassword", { required: true })}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm">Old password required</p>
            )}

            <Input
              label="New Password"
              type="password"
              {...register("newPassword", {
                required: true,
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message || "New password required"}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setActiveSelection(null)}
                className="px-4 py-1 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setActiveSelection("password")}
            className="text-blue-600 hover:underline">
            Change Password
          </button>
        )}
      </div>

      {/* Update Account */}
      <div className="border-t pt-4">
        {activeSelection === "account" ? (
          <form
            onSubmit={handleSubmit(handleAccountUpdate)}
            className="space-y-3">
            <Input
              label="Full Name"
              {...register("fullName", {
                validate: (v) => v.trim() !== "" || "Cannot be empty",
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}

            <Input
              label="Phone Number"
              {...register("phoneNumber", {
                validate: (v) => v.trim() !== "" || "Cannot be empty",
              })}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}

            <Input
              label="Email"
              {...register("email", {
                validate: (v) => v.trim() !== "" || "Cannot be empty",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Update Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSelection(null)}
                className="px-4 py-1 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setActiveSelection("account")}
            className="text-blue-600 hover:underline">
            Update Account Details
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
