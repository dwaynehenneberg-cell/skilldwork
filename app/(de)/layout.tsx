import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import LayoutShell from "../layout-shell";

export const metadata: Metadata = {
  title: "skilldwork — Aus Diensten werden digitale Workflows.",
  description:
    "Skilldwork macht aus deinem Dienst einen digitalen Workflow, damit du dich um Marketing und die Entscheidungen kümmern kannst, die nur du treffen kannst.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <LayoutShell locale="de">{children}</LayoutShell>;
}
