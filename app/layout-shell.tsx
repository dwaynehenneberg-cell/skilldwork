import type { ReactNode } from "react";
import { Anton, Geist } from "next/font/google";
import "./globals.css";
import CampaignCapture from "./campaign-capture";
import ConsentBanner from "./consent-banner";
import type { Locale } from "./copy";
import MetaPixel from "./meta-pixel";
import RedditPixel from "./reddit-pixel";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Runs before paint so the saved/system theme applies without a flash.
const themeScript = `try {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}`;

/**
 * The document shell both root layouts render. Each locale has its own root
 * layout so `lang` matches the language of the page actually being read.
 */
export default function LayoutShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${anton.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <CampaignCapture />
        <ConsentBanner locale={locale} />
        <RedditPixel />
        <MetaPixel />
      </body>
    </html>
  );
}
