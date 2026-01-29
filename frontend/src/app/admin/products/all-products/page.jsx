"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/services/products.api";
import ProductCard from "@/components/admin/ProductCard";
import Link from "next/link";

export default function page() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link
          href="/admin/products/add-product"
          className="bg-black text-white px-4 py-2">
          Create Product
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onRefresh={fetchProducts}
          />
        ))}
      </div>
    </div>
  );
}
