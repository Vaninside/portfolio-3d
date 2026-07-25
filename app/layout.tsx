import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/useTranslation";
import Navbar from "@/components/Navbar";
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
  title: "Evan Rafif Pradana | Portfolio",
  description:
    "Portfolio of Evan Rafif Pradana — Informatics Engineering graduate, Frontend Developer, and problem solver.",
  openGraph: {
    title: "Evan Rafif Pradana",
    description:
      "Informatics Engineering graduate & Frontend Developer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth dark`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
          <I18nProvider>
            <Navbar />
            {children}
          </I18nProvider>
      </body>
    </html>
  );
}