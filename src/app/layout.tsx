import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";
export const metadata: Metadata = {
  title: "Web Synth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-gray-950 text-white p-4">
        {children}
        <Analytics/>
        <SpeedInsights />
      </body>
    </html>
  );
}
