import { COPY, type Locale } from "./copy";
import { revealOnView } from "./reveal";
import ScrollReveal from "./scroll-reveal";

export default function Mission({ locale }: { locale: Locale }) {
  const copy = COPY[locale].mission;

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
          {copy.eyebrow}
        </p>
        <h2
          id="mission-title"
          className={`${revealOnView} mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-[var(--text)] delay-100 sm:text-5xl`}
        >
          {copy.title}
        </h2>
        <p
          className={`${revealOnView} mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-text)] delay-200 sm:text-base`}
        >
          {copy.lead}
        </p>
        <p
          className={`${revealOnView} mt-6 rounded-xl bg-[var(--field-bg)] px-4 py-3 text-xs leading-5 text-[var(--text)] delay-300 sm:text-sm`}
        >
          {copy.body}
        </p>
      </ScrollReveal>
    </section>
  );
}
