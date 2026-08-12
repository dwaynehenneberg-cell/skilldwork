"use client";

import { revealOnView } from "./reveal";
import ScrollReveal from "./scroll-reveal";
import { useSiteI18n } from "@/lib/site-i18n";

export default function Mission() {
  const { t } = useSiteI18n();

  return (
    <section
      id="mission"
      className="w-full scroll-mt-4 px-4 pb-16 sm:px-6 sm:pb-20"
      aria-labelledby="mission-title"
    >
      <ScrollReveal className="mx-auto max-w-7xl rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-8 dark:shadow-black/60">
        <p
          className={`${revealOnView} text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]`}
        >
          {t.mission.eyebrow}
        </p>
        <h2
          id="mission-title"
          className={`${revealOnView} mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-[var(--text)] delay-100 sm:text-5xl`}
        >
          {t.mission.title}
        </h2>
        <p
          className={`${revealOnView} mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-text)] delay-200 sm:text-base`}
        >
          {t.mission.lead}
        </p>
        <p
          className={`${revealOnView} mt-6 rounded-xl bg-[var(--field-bg)] px-4 py-3 text-xs leading-5 text-[var(--text)] delay-300 sm:text-sm`}
        >
          {t.mission.body}
        </p>
      </ScrollReveal>
    </section>
  );
}
