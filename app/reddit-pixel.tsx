"use client";

import { useEffect } from "react";

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

export function trackRedditLead() {
  if (
    typeof window !== "undefined" &&
    window.__skilldworkRedditPixelInitialized &&
    window.rdt
  ) {
    window.rdt("track", "Lead");
  }
}

export default function RedditPixel() {
  useEffect(() => {
    if (!REDDIT_PIXEL_ID || window.__skilldworkRedditPixelInitialized) {
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
  }, []);

  return null;
}
