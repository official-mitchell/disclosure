import type { Metadata } from "next";
import { Special_Elite, Crimson_Text } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson-text",
});

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
      <body className={`${specialElite.variable} ${crimsonText.variable}`}>{children}</body>
    </html>
  );
}
