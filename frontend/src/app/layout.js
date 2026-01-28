import ClientLayout from "./ClientLayout.jsx";
import "./globals.css";

export const metadata = {
  title: "Berce | Bags & Luggage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
