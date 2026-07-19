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
      <body>
        <div className="ambient-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
