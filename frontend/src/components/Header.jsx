"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveCategories } from "../services/categories.api.js";
import { getCurrentUser, logoutUser } from "@/services/users.api.js";

function Header() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getActiveCategories();
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getCurrentUser();
        setUser(loggedInUser ?? null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setOpen(false);
  };

  // Don't render profile button until mounted
  if (!mounted) {
    return (
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <Link href="/" className="font-bold text-xl">
          Logo
        </Link>

        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          {categories.map((category) => (
            <li key={category._id}>
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
          <li>
            <Link href="/our-story">Our Story</Link>
          </li>
        </ul>

        <div className="relative flex gap-4 items-center">
          <span>Search</span>
          <button disabled>Profile</button>
          <span>Cart</span>
        </div>
      </header>
    );
  }

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
          <div className="absolute right-0 top-10 bg-white border shadow p-4 rounded z-50">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
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
