import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./experience.css";
import "./glass.css";
import "./legal.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://remorse.dev",
  ),
  title: {
    default: "Remorse | Play Your Way",
    template: "%s | Remorse",
  },
  description:
    "Premium digital products for players who expect more. Instant delivery, flexible access, and trusted customer reviews.",
  applicationName: "Remorse",
  keywords: [
    "Remorse",
    "digital products",
    "gaming products",
    "instant delivery",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Remorse",
    title: "Remorse | Play Your Way",
    description:
      "Premium digital products for players who expect more. Instant delivery, flexible access, and trusted customer reviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remorse | Play Your Way",
    description:
      "Premium digital products for players who expect more. Instant delivery, flexible access, and trusted customer reviews.",
  },
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
