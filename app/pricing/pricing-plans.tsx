"use client";

import { useState } from "react";
import {
  CUSTOM_PLAN,
  PAID_PLANS,
  planCtaHref,
  formatEur,
  yearlyEffectiveMonthlyEur,
  yearlyPriceEur,
  yearlySavingsEur,
  type BillingPeriod,
  type Plan,
} from "@/lib/pricing";
import { useSiteI18n } from "@/lib/site-i18n";
import { revealOnLoad, revealOnView } from "../reveal";
import ScrollReveal from "../scroll-reveal";
import { FeatureTip } from "./feature-tip";

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
  accent = true,
}: {
  plan: Plan;
  billing: Billing;
  className?: string;
  label: string;
  soonLabel: string;
  /** Yellow conversion CTA; set false for secondary actions. */
  accent?: boolean;
}) {
  const href = planCtaHref(plan.id, billing);
  const base =
    "inline-flex w-full min-h-12 items-center justify-center rounded-full px-6 py-4 text-center font-display text-sm uppercase tracking-wider transition active:scale-[0.98] sm:text-base";

  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-[var(--card-border)] text-[var(--muted-text)] ${className ?? ""}`}
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
      className={`${base} ${
        accent
          ? "bg-[var(--workflow-accent)] text-black shadow-md shadow-black/10 hover:brightness-95 dark:shadow-black/40"
          : "bg-[var(--btn-bg)] text-[var(--btn-text)] hover:opacity-85"
      } ${className ?? ""}`}
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
  const isYearly = billing === "yearly";
  const displayPrice = isYearly ? yearlyEffectiveMonthlyEur(monthly) : monthly;
  const yearlyTotal = yearlyPriceEur(monthly);
  const savings = yearlySavingsEur(monthly);

  return (
    <article
      className={`${revealOnLoad} relative flex h-full flex-col rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-7 dark:shadow-black/60`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {plan.highlighted ? (
        <>
          <span className="sr-only">{t.pricingPage.mostPopular}</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
          >
            <span className="absolute -right-12 top-6 z-10 w-48 rotate-45 bg-[var(--workflow-accent)] px-4 py-2 text-center text-[0.6rem] font-semibold uppercase tracking-wide text-black shadow-sm">
              {t.pricingPage.mostPopular}
            </span>
          </span>
        </>
      ) : null}

      <div className="mb-5 space-y-2">
        <h2 className="font-display text-3xl tracking-tight text-[var(--text)]">{plan.name}</h2>
        <p className="text-sm leading-6 text-[var(--muted-text)]">{copy.description}</p>
      </div>

      <div className="mb-6">
        <p className="font-display text-4xl tracking-tight text-[var(--text)] sm:text-5xl">
          {formatEur(displayPrice)}
          <span className="ml-1 font-sans text-sm font-medium text-[var(--muted-text)]">
            {t.pricingPage.perMonth}
          </span>
        </p>
        {isYearly ? (
          <p className="mt-1 text-xs text-[var(--muted-text)]">
            {formatEur(yearlyTotal)} {t.pricingPage.billedYearly}
            {" · "}
            <span className="font-medium text-[var(--workflow-accent)]">
              {t.pricingPage.yearlySave} {formatEur(savings)}
            </span>
          </p>
        ) : null}
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {copy.includesFrom ? (
          <li className="text-sm font-medium leading-5 text-[var(--text)]">{copy.includesFrom}</li>
        ) : null}
        {copy.highlights.map((item) => (
          <li key={item.text} className="flex items-start gap-3">
            <CheckIcon />
            <FeatureTip tip={item.tip}>{item.text}</FeatureTip>
          </li>
        ))}
      </ul>

      <PlanCta
        plan={plan}
        billing={billing}
        label={billing === "yearly" ? copy.ctaYearly : copy.ctaMonthly}
        soonLabel={t.pricingPage.linkSoon}
      />
    </article>
  );
}

export default function PricingPlans() {
  const { t } = useSiteI18n();
  const [billing, setBilling] = useState<Billing>("yearly");
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
            aria-pressed={billing === "monthly"}
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
            aria-pressed={billing === "yearly"}
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
              label={
                billing === "yearly" ? customCopy.ctaYearly : customCopy.ctaMonthly
              }
              soonLabel={t.pricingPage.linkSoon}
              accent={false}
            />
          </div>
        </aside>
      </ScrollReveal>
    </div>
  );
}
