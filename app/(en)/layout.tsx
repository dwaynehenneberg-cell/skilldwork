import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import LayoutShell from "../layout-shell";

export const metadata: Metadata = {
  title: "skilldwork — Turn services into digital workflows.",
  description:
    "Skilldwork turns your service into a digital workflow so you can focus on marketing and expert decisions.",
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/de" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <LayoutShell locale="en">{children}</LayoutShell>;
}
