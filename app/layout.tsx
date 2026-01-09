import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catastrophic Disclosure",
  description: "Mystery Game - GM Clue Release System",
  icons: {
    icon: "/favicon.ico",
    apple: "/Catastrophic Disclosure icon.png",
  },
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
