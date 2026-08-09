import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk"
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-plus-jakarta-sans"
});

export const metadata: Metadata = {
  title: {
    default: "AthlexForce",
    template: "%s | AthlexForce"
  },
  applicationName: "AthlexForce",
  description: "AthlexForce athlete app",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "AthlexForce",
    description: "AthlexForce athlete app",
    siteName: "AthlexForce"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AthlexForce"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${plusJakartaSans.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
