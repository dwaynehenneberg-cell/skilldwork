"use client";

import { useEffect } from "react";
import { useConsent } from "./consent";

const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

declare global {
  interface Window {
    __skilldworkRedditPixelInitialized?: boolean;
    rdt?: ((...args: unknown[]) => void) & {
      callQueue?: unknown[][];
      sendEvent?: (...args: unknown[]) => void;
    };
  }
}

function trackRedditEvent(event: "Lead" | "ViewContent") {
  if (
    typeof window !== "undefined" &&
    window.__skilldworkRedditPixelInitialized &&
    window.rdt
  ) {
    window.rdt("track", event);
  }
}

/** A confirmed booking — the conversion campaigns optimise for. */
export function trackRedditLead() {
  trackRedditEvent("Lead");
}

/** The scheduler was opened, the step between a visit and a booking. */
export function trackRedditBookingOpened() {
  trackRedditEvent("ViewContent");
}

export default function RedditPixel() {
  const consent = useConsent();

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

  return null;
}
