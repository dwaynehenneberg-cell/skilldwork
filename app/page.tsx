"use client";

import Link from "next/link";
import BookingWidget from "./booking-widget";
import Mission from "./mission";
import { revealOnLoad } from "./reveal";
import SiteHeader from "./site-header";
import WorkflowMap from "./workflow-map";
import { useSiteI18n } from "@/lib/site-i18n";

export default function Home() {
  const { t } = useSiteI18n();

  return (
    <main className="relative min-h-screen">
      <SiteHeader floating logoHref={false} priority />

      <section
        id="book"
        className="flex min-h-screen w-full items-center justify-center px-4 pb-16 pt-40 sm:px-6 sm:py-36"
      >
        <div className="w-full max-w-xl rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
          <p
            className={`${revealOnLoad} mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]`}
          >
            {t.home.eyebrow}
          </p>
          <h1
            className={`${revealOnLoad} font-display text-4xl leading-[1.08] tracking-tight text-[var(--text)] [animation-delay:100ms] sm:text-5xl`}
          >
            {t.home.title}
          </h1>
          <div className={`${revealOnLoad} [animation-delay:200ms]`}>
            <BookingWidget />
          </div>
        </div>
      </section>

      <WorkflowMap />

      <Mission />

      <footer className="px-4 pb-8 text-center sm:px-6">
        <div className="flex justify-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
          >
            {t.nav.privacy}
          </Link>
          <Link
            href="/agb"
            className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
          >
            {t.nav.agb}
          </Link>
        </div>
      </footer>
    </main>
  );
}
