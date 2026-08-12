"use client";

import { useState } from "react";
import {
  CUSTOM_PLAN,
  PAID_PLANS,
  planCtaHref,
  formatEur,
  yearlyPriceEur,
  type BillingPeriod,
  type Plan,
} from "@/lib/pricing";
import { useSiteI18n } from "@/lib/site-i18n";
import { revealOnLoad, revealOnView } from "../reveal";
import ScrollReveal from "../scroll-reveal";

type Billing = BillingPeriod;

function CheckIcon() {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--workflow-accent)] text-[var(--text)]"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PlanCta({
  plan,
  billing,
  className,
  label,
  soonLabel,
}: {
  plan: Plan;
  billing: Billing;
  className?: string;
  label: string;
  soonLabel: string;
}) {
  const href = planCtaHref(plan.id, billing);

  if (!href) {
    return (
      <span
        className={`inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-[var(--card-border)] px-5 py-3.5 font-display text-sm uppercase tracking-wider text-[var(--muted-text)] ${className ?? ""}`}
      >
        {soonLabel}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex w-full items-center justify-center rounded-full bg-[var(--btn-bg)] px-5 py-3.5 font-display text-sm uppercase tracking-wider text-[var(--btn-text)] transition hover:opacity-85 ${className ?? ""}`}
    >
      {label}
    </a>
  );
}

function PlanCard({
  plan,
  billing,
  delayMs,
}: {
  plan: Plan;
  billing: Billing;
  delayMs: number;
}) {
  const { t } = useSiteI18n();
  const copy = t.plans[plan.id];
  const monthly = plan.monthlyPriceEur!;
  const price = billing === "yearly" ? yearlyPriceEur(monthly) : monthly;
  const periodLabel = billing === "yearly" ? t.pricingPage.perYear : t.pricingPage.perMonth;

  return (
    <article
      className={`${revealOnLoad} flex h-full flex-col rounded-3xl border bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-7 dark:shadow-black/60 ${
        plan.highlighted
          ? "border-[var(--text)] ring-1 ring-[var(--text)]"
          : "border-[var(--card-border)]"
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="mb-5 space-y-2">
        {plan.highlighted ? (
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
            {t.pricingPage.mostPopular}
          </p>
        ) : null}
        <h2 className="font-display text-3xl tracking-tight text-[var(--text)]">{plan.name}</h2>
        <p className="text-sm leading-6 text-[var(--muted-text)]">{copy.description}</p>
      </div>

      <div className="mb-6">
        <p className="font-display text-4xl tracking-tight text-[var(--text)] sm:text-5xl">
          {formatEur(price)}
          <span className="ml-1 font-sans text-sm font-medium text-[var(--muted-text)]">
            {periodLabel}
          </span>
        </p>
        {billing === "yearly" ? (
          <p className="mt-1 text-xs text-[var(--muted-text)]">
            {formatEur(monthly)} {t.pricingPage.billedYearly}
          </p>
        ) : null}
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {copy.highlights.map((line) => (
          <li key={line} className="flex items-start gap-3">
            <CheckIcon />
            <span className="text-sm leading-5 text-[var(--muted-text)]">{line}</span>
          </li>
        ))}
      </ul>

      <PlanCta
        plan={plan}
        billing={billing}
        label={copy.ctaLabel}
        soonLabel={t.pricingPage.linkSoon}
      />
    </article>
  );
}

export default function PricingPlans() {
  const { t } = useSiteI18n();
  const [billing, setBilling] = useState<Billing>("monthly");
  const customCopy = t.plans.custom;

  return (
    <div className="space-y-14">
      <div className={`${revealOnLoad} flex justify-center pt-3 [animation-delay:150ms]`}>
        <div
          className="relative inline-flex items-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-1 shadow-lg shadow-black/5 dark:shadow-black/40"
          role="group"
          aria-label={t.pricingPage.billingLabel}
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              billing === "monthly"
                ? "bg-[var(--btn-bg)] text-[var(--btn-text)]"
                : "text-[var(--muted-text)] hover:text-[var(--text)]"
            }`}
          >
            {t.pricingPage.monthly}
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
              billing === "yearly"
                ? "bg-[var(--btn-bg)] text-[var(--btn-text)]"
                : "text-[var(--muted-text)] hover:text-[var(--text)]"
            }`}
          >
            {t.pricingPage.yearly}
            <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[calc(100%-0.35rem)] whitespace-nowrap rounded-full bg-[var(--workflow-accent)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-black shadow-sm">
              {t.pricingPage.monthsFree}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {PAID_PLANS.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} delayMs={200 + index * 80} />
        ))}
      </div>

      <ScrollReveal>
        <aside
          className={`${revealOnView} flex flex-col gap-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:shadow-black/60`}
        >
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              {t.pricingPage.beyond}
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--text)]">
              {CUSTOM_PLAN.name}
            </h2>
            <p className="text-sm leading-6 text-[var(--muted-text)]">{customCopy.description}</p>
          </div>
          <div className="w-full shrink-0 sm:w-56">
            <PlanCta
              plan={CUSTOM_PLAN}
              billing={billing}
              label={customCopy.ctaLabel}
              soonLabel={t.pricingPage.linkSoon}
            />
          </div>
        </aside>
      </ScrollReveal>
    </div>
  );
}
