"use client";

import { useEffect, useRef, useState } from "react";

type Step = "idle" | "book" | "done";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

let calendlyLoader: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (!calendlyLoader) {
    calendlyLoader = new Promise((resolve) => {
      if (window.Calendly) {
        resolve();
        return;
      }
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(stylesheet);

      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
  return calendlyLoader;
}

export default function WaitlistForm() {
  const [step, setStep] = useState<Step>("idle");
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin === "https://calendly.com" &&
        event.data?.event === "calendly.event_scheduled"
      ) {
        setStep("done");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (step !== "book" || !CALENDLY_URL) return;

    let cancelled = false;
    loadCalendly().then(() => {
      const el = embedRef.current;
      if (cancelled || !el || el.hasChildNodes()) return;

      const dark = document.documentElement.classList.contains("dark");
      const params = new URLSearchParams({
        hide_gdpr_banner: "1",
        background_color: dark ? "1a1a19" : "ffffff",
        text_color: dark ? "ffffff" : "0a0a0a",
        primary_color: dark ? "ffffff" : "0a0a0a",
      });

      window.Calendly?.initInlineWidget({
        url: `${CALENDLY_URL}?${params.toString()}`,
        parentElement: el,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [step]);

  if (step === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-5 py-4 text-sm text-[var(--muted-text)]">
        Thanks — your call is booked. We look forward to talking to you.
      </div>
    );
  }

  if (step === "book") {
    return (
      <div className="mt-8 booking-open">
        <p className="mb-3 text-sm text-[var(--muted-text)]">
          Pick a time that works for you:
        </p>
        <div
          ref={embedRef}
          className="h-[620px] w-full min-w-0 overflow-hidden rounded-2xl sm:h-[700px]"
        />
      </div>
    );
  }

  return (
    <button
      className="mt-8 w-full rounded-full bg-[var(--btn-bg)] px-5 py-3.5 font-display text-sm uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
      onClick={() => setStep(CALENDLY_URL ? "book" : "done")}
      type="button"
    >
      Book a call
    </button>
  );
}
