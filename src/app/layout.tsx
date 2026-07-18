import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pivot — your thinking partner",
  description:
    "A calm, conversational AI decision coach. Talk through a hard choice, one gentle question at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
