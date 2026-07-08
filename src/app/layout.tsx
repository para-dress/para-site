import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Manrope } from "next/font/google";
import { CookieBanner } from "@/components/site/CookieBanner";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { SiteChrome } from "@/components/site/SiteChrome";
import "./globals.css";

const bodySans = Manrope({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paradress.co.uk"),
  title: "Para Dress | UK Bridal",
  description:
    "Para Dress is a premium bridal brand offering handcrafted gowns directly to brides across the UK.",
  openGraph: {
    title: "Para Dress | UK Bridal",
    description:
      "Premium bridal dresses made in Ukraine for brides in the UK, with personal support and custom sizing available.",
    url: "https://paradress.co.uk",
    siteName: "Para Dress",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Para Dress | UK Bridal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Para Dress | UK Bridal",
    description:
      "Premium bridal dresses made in Ukraine for brides in the UK, with personal support and custom sizing available.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/favicon.ico" }],
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
      className={`${bodySans.variable} ${displaySerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] flex flex-col">
        <GoogleAnalytics />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
