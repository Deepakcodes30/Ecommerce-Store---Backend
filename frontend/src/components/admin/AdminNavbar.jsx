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
                  href="/admin/products/add"
                  className={`block p-2 rounded ${
                    isActive("/admin/products/add") ? "bg-black text-white" : ""
                  }`}>
                  Add Product
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/products"
                  className={`block p-2 rounded ${
                    isActive("/admin/products") ? "bg-black text-white" : ""
                  }`}>
                  All Products
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Categories */}
        <li>
          <Link
            href="/admin/categories"
            className={`block p-2 rounded ${
              isActive("/admin/categories") ? "bg-black text-white" : ""
            }`}>
            Categories
          </Link>
        </li>

        {/* Coupons */}
        <li>
          <Link
            href="/admin/coupons"
            className={`block p-2 rounded ${
              isActive("/admin/coupons") ? "bg-black text-white" : ""
            }`}>
            Coupons
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default AdminNavbar;
