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

/**
 * Paste a YouTube or Loom share URL here after upload.
 * Empty = cover poster only (play UI ready, no embed yet).
 */
export const SALES_VIDEO_URL = "https://youtu.be/lenN_NAg-ug";

export function toEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      const shorts = u.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts?.[1]) {
        return `https://www.youtube.com/embed/${shorts[1]}?autoplay=1&rel=0`;
      }
      const embed = u.pathname.match(/\/embed\/([^/]+)/);
      if (embed?.[1]) {
        return `https://www.youtube.com/embed/${embed[1]}?autoplay=1&rel=0`;
      }
    }
    if (u.hostname.includes("loom.com")) {
      const share = u.pathname.match(/\/share\/([a-zA-Z0-9]+)/);
      if (share?.[1]) {
        return `https://www.loom.com/embed/${share[1]}?autoplay=1`;
      }
      const embed = u.pathname.match(/\/embed\/([a-zA-Z0-9]+)/);
      if (embed?.[1]) {
        return `https://www.loom.com/embed/${embed[1]}?autoplay=1`;
      }
    }
  } catch {
    return null;
  }

  return null;
}
