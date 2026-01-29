"use client";

import Header from "../components/layouts/Header.jsx";
import Footer from "../components/layouts/Footer.jsx";
import "./globals.css";

const metadata = {
  title: "Berce | Bags & Luggage",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
