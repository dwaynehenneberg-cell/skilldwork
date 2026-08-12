export type OfferId = "check" | "full";

export type Offer = {
  id: OfferId;
  priceEur: number | null;
  pricing: "fixed" | "free";
  deliveryDays: number;
  /** null = unlimited */
  revisions: number | null;
};

export const OFFERS: Offer[] = [
  {
    id: "check",
    priceEur: 250,
    pricing: "fixed",
    deliveryDays: 2,
    revisions: null,
  },
  {
    id: "full",
    priceEur: null,
    pricing: "free",
    deliveryDays: 14,
    revisions: null,
  },
];

export function getOffer(id: OfferId | string | null | undefined): Offer {
  return OFFERS.find((o) => o.id === id) ?? OFFERS[0];
}

export function formatOfferPrice(
  offer: Offer,
  locale: "en" | "de",
  freeLabel: string,
): string {
  if (offer.pricing === "free" || offer.priceEur == null) return freeLabel;
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

export const DEMO_DOMAIN = "demo.skilldwork.com/sales/foerderklar";
