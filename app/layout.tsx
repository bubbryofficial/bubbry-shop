import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bubbry — Your Local Shop",
  description: "India's smart local shop platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
