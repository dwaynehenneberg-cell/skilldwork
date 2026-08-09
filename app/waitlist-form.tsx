"use client";

import { useEffect, useRef, useState } from "react";

type Step = "form" | "book" | "done";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string };
      }) => void;
    };
  }
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

const fieldClass =
  "w-full rounded-full border border-[var(--field-border)] bg-[var(--field-bg)] px-5 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] outline-none transition focus:border-[var(--field-border-focus)]";

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
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState(false);
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
        prefill: { name },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [step, name]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company }),
      });
      if (!res.ok) throw new Error("request failed");
      setStep(CALENDLY_URL ? "book" : "done");
    } catch {
      setError(true);
    }
  }

  if (step === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-5 py-4 text-sm text-[var(--muted-text)]">
        You&rsquo;re on the list — we&rsquo;ll be in touch to book your call.
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
    <form onSubmit={onSubmit} className="mt-8 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          aria-label="Name"
          autoComplete="name"
          className={fieldClass}
          maxLength={120}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          value={name}
        />
        <input
          aria-label="Company"
          autoComplete="organization"
          className={fieldClass}
          maxLength={120}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          required
          value={company}
        />
      </div>
      <button
        className="w-full rounded-full bg-[var(--btn-bg)] px-5 py-3.5 font-display text-sm uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)] disabled:opacity-50"
        type="submit"
      >
        Book a call
      </button>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
