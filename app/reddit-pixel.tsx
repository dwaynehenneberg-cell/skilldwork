"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

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

  useEffect(() => {
    if (
      consent !== "accepted" ||
      !REDDIT_PIXEL_ID ||
      window.__skilldworkRedditPixelInitialized
    ) {
      return;
    }

    if (!window.rdt) {
      const queue = function (...args: unknown[]) {
        if (queue.sendEvent) {
          queue.sendEvent(...args);
        } else {
          queue.callQueue?.push(args);
        }
      } as NonNullable<Window["rdt"]>;
      queue.callQueue = [];
      window.rdt = queue;

      const script = document.createElement("script");
      script.src = `https://www.redditstatic.com/ads/pixel.js?pixel_id=${encodeURIComponent(REDDIT_PIXEL_ID)}`;
      script.async = true;
      document.head.appendChild(script);
    }

    window.rdt("init", REDDIT_PIXEL_ID, {
      optOut: false,
      useDecimalCurrencyValues: true,
    });
    window.rdt("track", "PageVisit");
    window.__skilldworkRedditPixelInitialized = true;
  }, [consent]);

  function choose(value: Consent) {
    saveConsent(value);
    setIsEditing(false);
  }

  return (
    <>
      {isChoosing ? (
        <aside
          aria-label="Privacy choices"
          className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-lg shadow-black/15 sm:left-3 sm:right-auto sm:w-[22rem]"
        >
          <p className="text-xs leading-5 text-[var(--muted-text)]">
            Allow optional Reddit measurement for visits and completed bookings.{" "}
            <Link
              href="/privacy"
              className="text-[var(--text)] underline underline-offset-4"
            >
              Learn more
            </Link>
            .
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="flex-1 rounded-full border border-[var(--field-border)] px-3 py-2 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--field-bg)]"
              onClick={() => choose("declined")}
              type="button"
            >
              No thanks
            </button>
            <button
              className="flex-1 rounded-full bg-[var(--btn-bg)] px-3 py-2 text-xs font-medium text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
              onClick={() => choose("accepted")}
              type="button"
            >
              Allow
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
