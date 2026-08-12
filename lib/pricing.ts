export type PlanId = "freelancer" | "freelancer-pro" | "agency" | "custom";

export type FeatureValue = boolean | string;

export type PlanFeature = {
  label: string;
  value: FeatureValue;
};

/** Structural plan data. Marketing copy lives in site-dictionaries. */
export type Plan = {
  id: PlanId;
  name: string;
  /** Monthly list price in EUR. Null = custom / contact sales. */
  monthlyPriceEur: number | null;
  highlighted?: boolean;
  features: PlanFeature[];
};

/** Two months free on yearly billing (pay 10, get 12). */
export function yearlyPriceEur(monthly: number): number {
  return monthly * 10;
}

/** Effective monthly rate when paying yearly, rounded for display. */
export function yearlyEffectiveMonthlyEur(monthly: number): number {
  return Math.round(yearlyPriceEur(monthly) / 12);
}

/** Savings vs paying 12× monthly. */
export function yearlySavingsEur(monthly: number): number {
  return monthly * 2;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Plans scale by concurrent Service Runs and Sales Pages.
 * Prices: 99 / 299 / 999 — display names Freelancer / Pro / Business.
 */
export const PLANS: Plan[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    monthlyPriceEur: 99,
    features: [
      { label: "Active Sales Pages", value: "1" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "2" },
      { label: "Transaction fee", value: "10%" },
      { label: "Provider seats", value: "1" },
      { label: "Client Portal", value: true },
      { label: "Provider Workspace", value: true },
      { label: "Human-in-the-loop", value: true },
      { label: "Custom domain", value: false },
      { label: "Affiliate links", value: false },
      { label: "Team roles", value: false },
      { label: "Workflow history", value: "7 days" },
    ],
  },
  {
    id: "freelancer-pro",
    name: "Pro",
    monthlyPriceEur: 299,
    highlighted: true,
    features: [
      { label: "Active Sales Pages", value: "3" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "8" },
      { label: "Transaction fee", value: "2.9%" },
      { label: "Provider seats", value: "3" },
      { label: "Client Portal", value: true },
      { label: "Provider Workspace", value: true },
      { label: "Human-in-the-loop", value: true },
      { label: "Custom domain", value: true },
      { label: "Affiliate links", value: true },
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "30 days" },
    ],
  },
  {
    id: "agency",
    name: "Business",
    monthlyPriceEur: 999,
    features: [
      { label: "Active Sales Pages", value: "10" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "20" },
      { label: "Transaction fee", value: "2.9%" },
      { label: "Provider seats", value: "10" },
      { label: "Client Portal", value: true },
      { label: "Provider Workspace", value: true },
      { label: "Human-in-the-loop", value: true },
      { label: "Custom domain", value: true },
      { label: "Affiliate links", value: true },
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "90 days" },
    ],
  },
  {
    id: "custom",
    name: "Custom Solution",
    monthlyPriceEur: null,
    features: [
      { label: "Active Sales Pages", value: "Custom" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "Custom" },
      { label: "Transaction fee", value: "Custom" },
      { label: "Provider seats", value: "Custom" },
      { label: "Client Portal", value: true },
      { label: "Provider Workspace", value: true },
      { label: "Human-in-the-loop", value: true },
      { label: "Custom domain", value: true },
      { label: "Affiliate links", value: true },
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "Custom" },
    ],
  },
];

/** Paid plans high → low for price anchoring (Business first). */
export const PAID_PLANS = PLANS.filter((plan) => plan.monthlyPriceEur !== null).sort(
  (a, b) => (b.monthlyPriceEur ?? 0) - (a.monthlyPriceEur ?? 0),
);

export const CUSTOM_PLAN = PLANS.find((plan) => plan.id === "custom")!;

/** Differentiating rows only (identical features stay off the table). */
export const COMPARISON_ROWS = [
  "Active Sales Pages",
  "Offers per Sales Page",
  "Concurrent Service Runs",
  "Transaction fee",
  "Provider seats",
  "Client Portal",
  "Provider Workspace",
  "Human-in-the-loop",
  "Custom domain",
  "Affiliate links",
  "Team roles",
  "Workflow history",
] as const;

export type ComparisonRow = (typeof COMPARISON_ROWS)[number];

export function featureFor(plan: Plan, label: string): FeatureValue {
  return plan.features.find((f) => f.label === label)?.value ?? false;
}

const STRIPE_FREELANCER_MONTHLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER ||
  "https://buy.stripe.com/bJe7sNgDxfbd50Gekv6sw00";

const STRIPE_FREELANCER_YEARLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_YEARLY ||
  "https://buy.stripe.com/3cI00lcnhe7978O3FR6sw01";

export type BillingPeriod = "monthly" | "yearly";

/** CTA targets by plan + billing — static reads so Next inlines NEXT_PUBLIC_*. */
export const PLAN_CTA_HREFS: Record<
  PlanId,
  { monthly: string | null; yearly: string | null }
> = {
  freelancer: {
    monthly: STRIPE_FREELANCER_MONTHLY,
    yearly: STRIPE_FREELANCER_YEARLY,
  },
  "freelancer-pro": {
    monthly: process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_PRO || null,
    yearly: process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_PRO_YEARLY || null,
  },
  agency: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_URL_AGENCY || null,
    yearly: process.env.NEXT_PUBLIC_STRIPE_URL_AGENCY_YEARLY || null,
  },
  custom: {
    monthly: process.env.NEXT_PUBLIC_CALENDLY_URL || null,
    yearly: process.env.NEXT_PUBLIC_CALENDLY_URL || null,
  },
};

export function planCtaHref(planId: PlanId, billing: BillingPeriod): string | null {
  return PLAN_CTA_HREFS[planId][billing];
}
