"use client";

import Header from "../components/Header.jsx";
import Footer from "@/components/Footer.jsx";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
