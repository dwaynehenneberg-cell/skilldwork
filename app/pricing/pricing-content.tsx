"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  COMPARISON_ROWS,
  PAID_PLANS,
  featureFor,
  type FeatureValue,
} from "@/lib/pricing";
import { useSiteI18n } from "@/lib/site-i18n";
import { revealOnLoad, revealOnView } from "../reveal";
import ScrollReveal from "../scroll-reveal";
import SiteHeader from "../site-header";
import { FeatureTip } from "./feature-tip";
import PricingPlans from "./pricing-plans";

function IncludedCheck() {
  return (
    <span aria-label="Included" className="inline-flex text-[var(--text)]">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function SupportChannels({ labels }: { labels: { email: string; phone: string; messenger: string } }) {
  const iconClass = "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-2.5 text-[var(--text)]" aria-label={`${labels.email}, ${labels.phone}, ${labels.messenger}`}>
      <span title={labels.email} aria-hidden>
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" strokeLinejoin="round" />
          <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span title={labels.phone} aria-hidden>
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path
            d="M6.5 3.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3A2 2 0 0 1 17.5 18 13.5 13.5 0 0 1 4 4.5a2 2 0 0 1 2.5-1z"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span title={labels.messenger} aria-hidden>
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path
            d="M12 3.5c-4.7 0-8.5 3.4-8.5 7.6 0 2.4 1.2 4.5 3.1 5.9V20l2.8-1.5c.8.2 1.7.4 2.6.4 4.7 0 8.5-3.4 8.5-7.6S16.7 3.5 12 3.5z"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

function translateFeatureValue(
  value: FeatureValue,
  map: Record<string, string>,
  channelLabels: { email: string; phone: string; messenger: string },
): ReactNode {
  if (value === "channels") {
    return <SupportChannels labels={channelLabels} />;
  }
  if (typeof value === "boolean") {
    return value ? <IncludedCheck /> : <span className="text-[var(--muted-text)]">—</span>;
  }
  return <span className="font-medium text-[var(--text)]">{map[value] ?? value}</span>;
}

function FooterLinks() {
  const { t } = useSiteI18n();
  return (
    <footer className="mx-auto mt-16 flex max-w-6xl justify-center gap-4 px-1 pb-4 text-center">
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
    </footer>
  );
}

export default function PricingContent() {
  const { t } = useSiteI18n();
  const p = t.pricingPage;

  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <SiteHeader maxWidthClass="max-w-6xl" />

      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p
          className={`${revealOnLoad} mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]`}
        >
          {p.eyebrow}
        </p>
        <h1
          className={`${revealOnLoad} font-display text-4xl leading-[1.08] tracking-tight text-[var(--text)] [animation-delay:80ms] sm:text-6xl`}
        >
          {p.title}
        </h1>
        <p
          className={`${revealOnLoad} mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--muted-text)] [animation-delay:140ms]`}
        >
          {p.lead}
        </p>
      </header>

      <div className="mx-auto max-w-6xl">
        <PricingPlans />
      </div>

      <ScrollReveal className="mx-auto mt-20 max-w-6xl">
        <section className={`${revealOnView} space-y-6`}>
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              {p.compareEyebrow}
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--text)] sm:text-4xl">
              {p.compareTitle}
            </h2>
            <p className="text-sm leading-6 text-[var(--muted-text)]">{p.compareLead}</p>
          </div>

          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-2xl shadow-black/10 sm:p-6 dark:shadow-black/60">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="w-[34%] py-3 pr-3 font-medium text-[var(--muted-text)] sm:py-4 sm:pr-5">
                    {p.feature}
                  </th>
                  {PAID_PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className="py-3 px-1 font-display text-base tracking-tight text-[var(--text)] sm:px-3 sm:text-lg"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row} className="border-b border-[var(--card-border)] last:border-0">
                    <th className="py-3 pr-3 align-top font-normal text-[var(--muted-text)] sm:py-3.5 sm:pr-5">
                      <FeatureTip tip={t.featureTips[row]} placement="bottom">
                        <span>{t.featureLabels[row]}</span>
                      </FeatureTip>
                    </th>
                    {PAID_PLANS.map((plan) => (
                      <td key={plan.id} className="py-3 px-1 align-top sm:px-3 sm:py-3.5">
                        {translateFeatureValue(
                          featureFor(plan, row),
                          t.featureValues,
                          t.pricingPage.supportChannels,
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mx-auto mt-20 max-w-3xl">
        <section className={`${revealOnView} space-y-6`}>
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              {p.faqEyebrow}
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--text)]">{p.faqTitle}</h2>
          </div>

          <div className="space-y-4">
            {p.faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 open:pb-5"
              >
                <summary className="cursor-pointer list-none font-medium text-[var(--text)] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[var(--muted-text)] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <FooterLinks />
    </main>
  );
}
