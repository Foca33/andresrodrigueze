import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { getCopy } from "@/content";
import "./globals.css";

const josefin = localFont({
  src: [{ path: "../fonts/JosefinSans-var.woff2", style: "normal", weight: "100 700" }],
  variable: "--font-josefin",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/Newsreader-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/Newsreader-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const copy = getCopy(siteConfig.locale);

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: copy.meta.title,
  description: copy.meta.description,
  keywords: copy.meta.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  alternates: { canonical: "/", languages: { "es-CO": "/" /* "en": "/en" */ } },
  robots: siteConfig.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "book",
    locale: "es_CO",
    url: "/",
    siteName: "HELA · Lago de Fuego",
    title: copy.meta.ogTitle,
    description: copy.meta.description,
    // image: src/app/opengraph-image.jpg (1200×630) is picked up automatically
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.ogTitle,
    description: copy.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${josefin.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
