"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminNavbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const isActive = (path) => pathname === path;

  return (
    <aside className="w-64 min-h-screen border-r bg-gray-50 p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="flex flex-col gap-2">
        {/* Orders */}
        <li>
          <Link
            href="/admin/orders"
            className={`block p-2 rounded ${
              isActive("/admin/orders") ? "bg-black text-white" : ""
            }`}>
            Orders
          </Link>
        </li>

        {/* Products */}
        <li>
          <button
            onClick={() => toggleMenu("products")}
            className="w-full text-left p-2 rounded hover:bg-gray-200">
            Products
          </button>

          {openMenu === "products" && (
            <ul className="ml-4 mt-2 flex flex-col gap-1">
              <li>
                <Link
                  href="/admin/products/add-product"
                  className={`block p-2 rounded ${
                    isActive("/admin/products/add-product")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  Add Product
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/products/all-products"
                  className={`block p-2 rounded ${
                    isActive("/admin/products/all-products")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  All Products
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Categories */}
        <li>
          <button
            onClick={() => toggleMenu("categories")}
            className="w-full text-left p-2 rounded hover:bg-gray-200">
            Category
          </button>

          {openMenu === "categories" && (
            <ul className="ml-4 mt-2 flex flex-col gap-1">
              <li>
                <Link
                  href="/admin/categories/add-category"
                  className={`block p-2 rounded ${
                    isActive("/admin/categories/add-category")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  Add Category
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories/all-categories"
                  className={`block p-2 rounded ${
                    isActive("/admin/categories/all-categories")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  All Categories
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Coupons */}
        <li>
          <button
            onClick={() => toggleMenu("coupons")}
            className="w-full text-left p-2 rounded hover:bg-gray-200">
            Coupon
          </button>

          {openMenu === "coupons" && (
            <ul className="ml-4 mt-2 flex flex-col gap-1">
              <li>
                <Link
                  href="/admin/coupons/add-coupon"
                  className={`block p-2 rounded ${
                    isActive("/admin/coupons/add-coupon")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  Add Coupon
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/coupons/all-coupons"
                  className={`block p-2 rounded ${
                    isActive("/admin/coupons/all-coupons")
                      ? "bg-black text-white"
                      : ""
                  }`}>
                  All Coupons
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
}

export default AdminNavbar;
