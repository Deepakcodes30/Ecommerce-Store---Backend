"use client";

import Header from "../components/layouts/Header.jsx";
import Footer from "../components/layouts/Footer.jsx";

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
