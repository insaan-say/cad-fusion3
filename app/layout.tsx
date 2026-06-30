import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Industrial 3D Technology Transfer Platform",
  description:
    "Secure 3D technology transfer, remote engineering collaboration, AI engineering recommendations, and manufacturing optimization."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
