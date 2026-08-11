"use client";

import { useSyncExternalStore } from "react";

// One choice covers every advertising pixel on the site. Splitting it per
// platform would mean a second banner for the same question.
const CONSENT_KEY = "skilldwork-ad-measurement-consent";
const CONSENT_CHANGE_EVENT = "skilldwork-consent-change";

export type Consent = "accepted" | "declined";

function getConsentSnapshot(): Consent | "unset" {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved === "accepted" || saved === "declined" ? saved : "unset";
  } catch {
    return "unset";
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // A blocked storage still allows the choice for this page view.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function useConsent() {
  return useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => "unset" as const,
  );
}
