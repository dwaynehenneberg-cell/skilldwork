"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useSyncExternalStore } from "react";

const CONSENT_KEY = "skilldwork-ad-measurement-consent";
const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

type Consent = "accepted" | "declined";

const consentChangeEvent = "skilldwork-consent-change";

declare global {
  interface Window {
    __skilldworkRedditPixelInitialized?: boolean;
    rdt?: ((...args: unknown[]) => void) & {
      callQueue?: unknown[][];
      sendEvent?: (...args: unknown[]) => void;
    };
  }
}

export function trackRedditLead() {
  if (
    typeof window !== "undefined" &&
    window.__skilldworkRedditPixelInitialized &&
    window.rdt
  ) {
    window.rdt("track", "Lead");
  }
}

function getConsentSnapshot(): Consent | "unset" {
  const saved = localStorage.getItem(CONSENT_KEY);
  return saved === "accepted" || saved === "declined" ? saved : "unset";
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(consentChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(consentChangeEvent, onStoreChange);
  };
}

function saveConsent(value: Consent) {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(consentChangeEvent));
}

export default function RedditPixel() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => "unset",
  );
  const [isEditing, setIsEditing] = useState(false);
  const isChoosing = consent === "unset" || isEditing;

  function choose(value: Consent) {
    saveConsent(value);
    setIsEditing(false);
  }

  const pixelCode = REDDIT_PIXEL_ID
    ? `if (!window.__skilldworkRedditPixelInitialized) {
  !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(Array.prototype.slice.call(arguments))};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js";t.async=true;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
  rdt("init", ${JSON.stringify(REDDIT_PIXEL_ID)}, {optOut:false,useDecimalCurrencyValues:true});
  rdt("track", "PageVisit");
  window.__skilldworkRedditPixelInitialized = true;
}`
    : "";

  return (
    <>
      {consent === "accepted" && REDDIT_PIXEL_ID && (
        <Script id="reddit-pixel" strategy="afterInteractive">
          {pixelCode}
        </Script>
      )}

      {isChoosing ? (
        <aside
          aria-label="Privacy choices"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-2xl shadow-black/20 sm:p-5"
        >
          <p className="text-sm leading-6 text-[var(--muted-text)]">
            With your permission, we use the Reddit Pixel to measure page visits and completed
            bookings from our ads.{" "}
            <Link
              href="/privacy"
              className="text-[var(--text)] underline underline-offset-4"
            >
              Learn more
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-full border border-[var(--field-border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--field-bg)]"
              onClick={() => choose("declined")}
              type="button"
            >
              Decline
            </button>
            <button
              className="rounded-full bg-[var(--btn-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
              onClick={() => choose("accepted")}
              type="button"
            >
              Allow measurement
            </button>
          </div>
        </aside>
      ) : (
        <button
          className="fixed bottom-3 left-3 z-40 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs text-[var(--muted-text)] shadow-lg transition hover:text-[var(--text)]"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
