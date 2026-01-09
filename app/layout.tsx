import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catastrophic Disclosure",
  description: "Mystery Game - GM Clue Release System",
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
