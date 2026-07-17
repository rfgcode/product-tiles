import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Card Prototype",
  description: "Interaction prototype for the Used Equipment Store product card",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
