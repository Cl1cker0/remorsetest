import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./experience.css";
import "./glass.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Remorse.dev | Your game. Your way.",
  description:
    "Explore the official Remorse collection. Live availability, digital delivery, and secure checkout through Komerza.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} motion-enabled`}>
        {children}
      </body>
    </html>
  );
}
