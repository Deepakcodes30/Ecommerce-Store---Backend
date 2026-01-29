"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { getCurrentUser } from "@/services/users.api";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userData = await getCurrentUser();
        console.log("Admin check - User data:", userData); // Debug log
        console.log("Admin check - isAdmin:", userData?.isAdmin); // Debug log

        if (!userData) {
          console.log("No user data, redirecting to login");
          router.push("/login");
          return;
        }

        if (!userData.isAdmin) {
          console.log("User is not admin, redirecting to home");
          router.push("/");
          return;
        }

        console.log("User is admin, allowing access");
        setIsAdmin(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex">
      <AdminNavbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
