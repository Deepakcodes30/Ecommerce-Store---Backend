"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveCategories } from "../../services/categories.api.js";
import { getCurrentUser, logoutUser } from "@/services/users.api.js";

function Header() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getCurrentUser();
        setUser(loggedInUser ?? null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <Link href="/" className="font-bold text-xl">
        Logo
      </Link>

      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>

        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category._id}>
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          ))
        ) : (
          <li>No Categories</li>
        )}

        <li>
          <Link href="/our-story">Our Story</Link>
        </li>
      </ul>

      <div className="relative flex gap-4 items-center">
        <span>Search</span>

        <button onClick={() => setOpen((prev) => !prev)}>Profile</button>

        {open && authChecked && (
          <div className="absolute right-0 top-10 bg-white border shadow p-4 rounded z-50 min-w-[150px]">
            {user ? (
              user.isAdmin ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <hr />
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    Admin Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <hr />
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left">
                    Logout
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        <span>Cart</span>
      </div>
    </header>
  );
}

export default Header;
