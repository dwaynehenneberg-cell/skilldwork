import type { Metadata, Viewport } from "next";
import { Anton, Geist } from "next/font/google";
import { SiteI18nProvider } from "@/lib/site-i18n";
import "./globals.css";
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

export const metadata: Metadata = {
  title: "skilldwork — Turn services into digital workflows.",
  description:
    "Skilldwork turns your service into a digital workflow so you can focus on marketing and expert decisions.",
  icons: {
    icon: [
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Runs before paint so the saved/system theme applies without a flash.
const themeScript = `try {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
  var l = localStorage.getItem("skilldwork-locale");
  if (l === "en" || l === "de") document.documentElement.lang = l;
} catch (e) {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteI18nProvider>
          {children}
          <RedditPixel />
        </SiteI18nProvider>
      </body>
    </html>
  );
}
