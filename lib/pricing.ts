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
 * Sales Pages: 3 / 10 / Unlimited.
 */
export const PLANS: Plan[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    monthlyPriceEur: 99,
    features: [
      { label: "Workflow Builds", value: "Unlimited" },
      { label: "Users", value: "Unlimited" },
      { label: "Client & Provider apps", value: true },
      { label: "Active Sales Pages", value: "3" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "2" },
      { label: "Admin roles", value: false },
      { label: "Transaction fee", value: "10%" },
      { label: "Affiliate links", value: false },
      { label: "Workflow history", value: "7 days" },
      { label: "Support", value: "Email, phone + WhatsApp" },
      { label: "Community", value: "Last Humans Working" },
    ],
  },
  {
    id: "freelancer-pro",
    name: "Pro",
    monthlyPriceEur: 299,
    highlighted: true,
    features: [
      { label: "Workflow Builds", value: "Unlimited" },
      { label: "Users", value: "Unlimited" },
      { label: "Client & Provider apps", value: true },
      { label: "Active Sales Pages", value: "10" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "8" },
      { label: "Admin roles", value: true },
      { label: "Transaction fee", value: "2.9%" },
      { label: "Affiliate links", value: true },
      { label: "Workflow history", value: "30 days" },
      { label: "Support", value: "Email, phone + WhatsApp" },
      { label: "Community", value: "Last Humans Working" },
    ],
  },
  {
    id: "agency",
    name: "Business",
    monthlyPriceEur: 999,
    features: [
      { label: "Workflow Builds", value: "Unlimited" },
      { label: "Users", value: "Unlimited" },
      { label: "Client & Provider apps", value: true },
      { label: "Active Sales Pages", value: "Unlimited" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "20" },
      { label: "Admin roles", value: true },
      { label: "Transaction fee", value: "2.9%" },
      { label: "Affiliate links", value: true },
      { label: "Workflow history", value: "90 days" },
      { label: "Support", value: "Email, phone + WhatsApp" },
      { label: "Community", value: "Last Humans Working" },
    ],
  },
  {
    id: "custom",
    name: "Custom Solution",
    monthlyPriceEur: null,
    features: [
      { label: "Workflow Builds", value: "Unlimited" },
      { label: "Users", value: "Unlimited" },
      { label: "Client & Provider apps", value: true },
      { label: "Active Sales Pages", value: "Custom" },
      { label: "Offers per Sales Page", value: "Unlimited" },
      { label: "Concurrent Service Runs", value: "Custom" },
      { label: "Admin roles", value: true },
      { label: "Transaction fee", value: "Custom" },
      { label: "Affiliate links", value: true },
      { label: "Workflow history", value: "Custom" },
      { label: "Support", value: "Email, phone + WhatsApp" },
      { label: "Community", value: "Last Humans Working" },
    ],
  },
];

/** Paid plans high → low for price anchoring (Business first). */
export const PAID_PLANS = PLANS.filter((plan) => plan.monthlyPriceEur !== null).sort(
  (a, b) => (b.monthlyPriceEur ?? 0) - (a.monthlyPriceEur ?? 0),
);

export const CUSTOM_PLAN = PLANS.find((plan) => plan.id === "custom")!;

/** Shared features first, then plan differentiators. */
export const COMPARISON_ROWS = [
  "Workflow Builds",
  "Users",
  "Client & Provider apps",
  "Active Sales Pages",
  "Offers per Sales Page",
  "Concurrent Service Runs",
  "Admin roles",
  "Affiliate links",
  "Transaction fee",
  "Workflow history",
  "Support",
  "Community",
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

const STRIPE_PRO_MONTHLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_PRO ||
  "https://buy.stripe.com/00w8wR3QL6EH3WCb8j6sw02";

const STRIPE_PRO_YEARLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_PRO_YEARLY ||
  "https://buy.stripe.com/6oUdRb871fbdeBgdgr6sw03";

const STRIPE_BUSINESS_MONTHLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_AGENCY ||
  "https://buy.stripe.com/dRm3cxcnh7IL78Ofoz6sw04";

const STRIPE_BUSINESS_YEARLY =
  process.env.NEXT_PUBLIC_STRIPE_URL_AGENCY_YEARLY ||
  "https://buy.stripe.com/7sY4gBdrl8MP64Ka4f6sw05";

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
    monthly: STRIPE_PRO_MONTHLY,
    yearly: STRIPE_PRO_YEARLY,
  },
  agency: {
    monthly: STRIPE_BUSINESS_MONTHLY,
    yearly: STRIPE_BUSINESS_YEARLY,
  },
  custom: {
    monthly: process.env.NEXT_PUBLIC_CALENDLY_URL || null,
    yearly: process.env.NEXT_PUBLIC_CALENDLY_URL || null,
  },
};

export function planCtaHref(planId: PlanId, billing: BillingPeriod): string | null {
  return PLAN_CTA_HREFS[planId][billing];
}
