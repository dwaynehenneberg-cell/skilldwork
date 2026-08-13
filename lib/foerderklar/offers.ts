export type OfferId = "check" | "apply";

export type Offer = {
  id: OfferId;
  priceEur: number;
  pricing: "fixed";
  deliveryDays: number;
  /** null = unlimited */
  revisions: number | null;
};

/**
 * Package 1 — Förderkomplettcheck (€250): ranked shortlist + sources (DIY).
 * Package 2 — Antragsbegleitung (€1.490): check + guided application for one
 * programme. Standard market split (analysis vs. application support); fixed
 * fee fits skilldwork one-time offers better than success-fee retainers.
 */
export const OFFERS: Offer[] = [
  {
    id: "check",
    priceEur: 250,
    pricing: "fixed",
    deliveryDays: 2,
    revisions: null,
  },
  {
    id: "apply",
    priceEur: 1490,
    pricing: "fixed",
    deliveryDays: 14,
    revisions: null,
  },
];

export function getOffer(id: OfferId | string | null | undefined): Offer {
  if (id === "full") return OFFERS.find((o) => o.id === "apply") ?? OFFERS[0];
  return OFFERS.find((o) => o.id === id) ?? OFFERS[0];
}

export function formatOfferPrice(offer: Offer, locale: "en" | "de"): string {
  return `€${offer.priceEur.toLocaleString(locale === "de" ? "de-DE" : "en-US")}`;
}

export function formatRevisions(
  offer: Offer,
  unlimitedLabel: string,
  revisionsLabel: string,
): string {
  if (offer.revisions == null) return unlimitedLabel;
  return `${offer.revisions} ${revisionsLabel}`;
}

export const PROVIDER_SLUG = "foerderklar";
export const PROVIDER_PATH = `/${PROVIDER_SLUG}`;
export const DEMO_DOMAIN = `skilldwork.com/${PROVIDER_SLUG}`;

export const SALES_VIDEO_URL = "/foerderklar/foerderklar-explainer.mp4";
