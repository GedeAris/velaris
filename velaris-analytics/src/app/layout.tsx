import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velaris Analytics",
  description:
    "Velaris Analytics builds premium CRM systems, data analytics, BI dashboards, and business automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-black text-slate-100 antialiased selection:bg-[rgb(var(--v-cyan)_/_0.22)] selection:text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
