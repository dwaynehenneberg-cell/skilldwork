export type PlanId = "freelancer" | "freelancer-pro" | "agency" | "custom";

export type FeatureValue = boolean | string;

export type PlanFeature = {
  label: string;
  value: FeatureValue;
};

export type Plan = {
  id: PlanId;
  name: string;
  description: string;
  /** Monthly price in EUR. Null = custom / contact sales. */
  monthlyPriceEur: number | null;
  highlighted?: boolean;
  ctaLabel: string;
  features: PlanFeature[];
  /** Short bullets shown on the pricing card (Skool-style). */
  highlights: string[];
};

/** Two months free on yearly billing (Skool-style). */
export function yearlyPriceEur(monthly: number): number {
  return monthly * 10;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Skilldwork plans.
 *
 * Differentiator is concurrent Service Runs (each run is a full Client journey on
 * dedicated capacity), not monthly execution buckets like n8n. Sales Pages, fees,
 * and seats create the value steps at 99 / 299 / 999.
 */
export const PLANS: Plan[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    description: "One Sales Page, unlimited Offers — ship your first digital service.",
    monthlyPriceEur: 99,
    ctaLabel: "Start Freelancer",
    highlights: [
      "1 active Sales Page",
      "Unlimited Offers on that page",
      "2 concurrent Service Runs",
      "Client Portal + Provider Workspace",
      "Human-in-the-loop",
      "Direct support",
      "10% transaction fee",
    ],
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
      { label: "Team roles", value: false },
      { label: "Workflow history", value: "7 days" },
      { label: "Support", value: "Direct" },
    ],
  },
  {
    id: "freelancer-pro",
    name: "Freelancer Pro",
    description: "More Sales Pages, lower fees, and room to run services in production.",
    monthlyPriceEur: 299,
    highlighted: true,
    ctaLabel: "Start Freelancer Pro",
    highlights: [
      "3 active Sales Pages",
      "Unlimited Offers on every page",
      "8 concurrent Service Runs",
      "Custom domain + team roles",
      "Human-in-the-loop",
      "Direct support",
      "2.9% transaction fee",
    ],
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
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "30 days" },
      { label: "Support", value: "Direct" },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    description: "Ten active Sales Pages for agencies running multiple client services.",
    monthlyPriceEur: 999,
    ctaLabel: "Start Agency",
    highlights: [
      "10 active Sales Pages",
      "Unlimited Offers on every page",
      "20 concurrent Service Runs",
      "10 provider seats",
      "Custom domain + team roles",
      "Direct support",
      "2.9% transaction fee",
    ],
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
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "90 days" },
      { label: "Support", value: "Direct" },
    ],
  },
  {
    id: "custom",
    name: "Custom Solution",
    description:
      "Self-hosted, white-label, compliance, or limits beyond Agency — we design it with you.",
    monthlyPriceEur: null,
    ctaLabel: "Book a call",
    highlights: [
      "Custom Sales Page & concurrency limits",
      "Self-hosted or dedicated cloud",
      "Custom transaction fees",
      "Direct support",
    ],
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
      { label: "Team roles", value: true },
      { label: "Workflow history", value: "Custom" },
      { label: "Support", value: "Direct" },
    ],
  },
];

/** Paid plans high → low for price anchoring (Agency first). */
export const PAID_PLANS = PLANS.filter((plan) => plan.monthlyPriceEur !== null).sort(
  (a, b) => (b.monthlyPriceEur ?? 0) - (a.monthlyPriceEur ?? 0),
);
export const CUSTOM_PLAN = PLANS.find((plan) => plan.id === "custom")!;

/** Feature rows for the comparison table (paid plans only). */
export const COMPARISON_ROWS: { label: string; key: string }[] = [
  { label: "Active Sales Pages", key: "Active Sales Pages" },
  { label: "Offers per Sales Page", key: "Offers per Sales Page" },
  { label: "Concurrent Service Runs", key: "Concurrent Service Runs" },
  { label: "Transaction fee", key: "Transaction fee" },
  { label: "Provider seats", key: "Provider seats" },
  { label: "Client Portal", key: "Client Portal" },
  { label: "Provider Workspace", key: "Provider Workspace" },
  { label: "Human-in-the-loop", key: "Human-in-the-loop" },
  { label: "Custom domain", key: "Custom domain" },
  { label: "Team roles", key: "Team roles" },
  { label: "Workflow history", key: "Workflow history" },
  { label: "Support", key: "Support" },
];

export function featureFor(plan: Plan, label: string): FeatureValue {
  return plan.features.find((f) => f.label === label)?.value ?? false;
}

const STRIPE_FREELANCER =
  process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER ||
  "https://buy.stripe.com/bJe7sNgDxfbd50Gekv6sw00";

/** CTA targets — read statically so Next can inline NEXT_PUBLIC_* at build time. */
export const PLAN_CTA_HREFS: Record<PlanId, string | null> = {
  freelancer: STRIPE_FREELANCER,
  "freelancer-pro": process.env.NEXT_PUBLIC_STRIPE_URL_FREELANCER_PRO || null,
  agency: process.env.NEXT_PUBLIC_STRIPE_URL_AGENCY || null,
  custom: process.env.NEXT_PUBLIC_CALENDLY_URL || null,
};
