"use client";

import { useEffect } from "react";
import { useConsent } from "./consent";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    __skilldworkMetaPixelInitialized?: boolean;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function trackMetaEvent(event: "Schedule" | "ViewContent") {
  if (
    typeof window !== "undefined" &&
    window.__skilldworkMetaPixelInitialized &&
    window.fbq
  ) {
    window.fbq("track", event);
  }
}

/** A confirmed booking — the conversion campaigns optimise for. */
export function trackMetaSchedule() {
  trackMetaEvent("Schedule");
}

/** The scheduler was opened, the step between a visit and a booking. */
export function trackMetaBookingOpened() {
  trackMetaEvent("ViewContent");
}

export default function MetaPixel() {
  const consent = useConsent();

  useEffect(() => {
    if (
      consent !== "accepted" ||
      !META_PIXEL_ID ||
      window.__skilldworkMetaPixelInitialized
    ) {
      return;
    }

    if (!window.fbq) {
      const queue = function (...args: unknown[]) {
        if (queue.callMethod) {
          queue.callMethod(...args);
        } else {
          queue.queue?.push(args);
        }
      } as Fbq;
      queue.push = queue;
      queue.loaded = true;
      queue.version = "2.0";
      queue.queue = [];
      window.fbq = queue;
      window._fbq = queue;

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.async = true;
      document.head.appendChild(script);
    }

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
    window.__skilldworkMetaPixelInitialized = true;
  }, [consent]);

  return null;
}
