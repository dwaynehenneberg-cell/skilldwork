import type { Metadata } from "next";
import { I18nProvider } from "@/lib/foerderklar/i18n";
import { StoreProvider } from "@/lib/foerderklar/store";
import "./foerderklar.css";

export const metadata: Metadata = {
  title: "FörderKlar — Find funding that fits",
  description:
    "One-time grant consulting for German SMEs. Funding check from €250 or full application support.",
};

export default function FoerderklarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <StoreProvider>
        <div className="fk-shell min-h-screen">{children}</div>
      </StoreProvider>
    </I18nProvider>
  );
}
