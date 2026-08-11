"use client";

// Campaign parameters land on the site as query parameters from an ad click.
// They are kept for the session so a booking that happens after a detour
// through /privacy or a reload still carries the campaign that paid for it.

const STORAGE_KEY = "skilldwork-campaign";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

// Reddit and Meta append their own click identifiers. They are kept for
// server-side conversion reporting and are not sent to Calendly.
const CLICK_ID_KEYS = ["rdt_cid", "fbclid"] as const;

const CAMPAIGN_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS] as const;

export type CampaignKey = (typeof CAMPAIGN_KEYS)[number];
export type Campaign = Partial<Record<CampaignKey, string>>;

function read(): Campaign {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Campaign) : {};
  } catch {
    return {};
  }
}

/**
 * Stores the campaign parameters of the current URL. The first click of a
 * session wins, so an internal link without parameters cannot overwrite it.
 */
export function captureCampaign() {
  const params = new URLSearchParams(window.location.search);
  const captured: Campaign = {};

  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key)?.trim();
    if (value) captured[key] = value.slice(0, 200);
  }

  if (Object.keys(captured).length === 0) return;

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // Session storage can be unavailable; attribution is optional.
  }
}

/** The UTM parameters Calendly recognises, so a booking shows its source. */
export function getCalendlyUtmParams(): Record<string, string> {
  const campaign = read();
  const params: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = campaign[key];
    if (value) params[key] = value;
  }

  return params;
}
