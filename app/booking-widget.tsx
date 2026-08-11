"use client";

import Script from "next/script";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { OPEN_BOOKING_EVENT, requestBookingOpen } from "./booking-intent";
import { trackRedditLead } from "./reddit-pixel";

type Step = "idle" | "book" | "done";
type CalendlyStatus = "idle" | "loading" | "ready" | "error";

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
const CALENDLY_STYLESHEET_ID = "calendly-widget-styles";

export default function BookingWidget() {
  const [step, setStep] = useState<Step>("idle");
  const [calendlyStatus, setCalendlyStatus] = useState<CalendlyStatus>("idle");
  const [bookingRequest, setBookingRequest] = useState(0);
  const embedRef = useRef<HTMLDivElement>(null);
  const leadTrackedRef = useRef(false);

  function showHowItWorks() {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    function openBooking() {
      if (CALENDLY_URL) {
        setStep((current) => (current === "done" ? current : "book"));
        setCalendlyStatus((current) => (current === "ready" ? current : "loading"));
      }
      setBookingRequest((current) => current + 1);
    }

    window.addEventListener(OPEN_BOOKING_EVENT, openBooking);
    return () => window.removeEventListener(OPEN_BOOKING_EVENT, openBooking);
  }, []);

  useLayoutEffect(() => {
    if (bookingRequest === 0) return;

    const bookingSection = document.getElementById("book");
    window.scrollTo({
      behavior: "auto",
      top: bookingSection?.offsetTop ?? 0,
    });
  }, [bookingRequest]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin === "https://calendly.com" &&
        event.data?.event === "calendly.event_scheduled" &&
        !leadTrackedRef.current
      ) {
        leadTrackedRef.current = true;
        trackRedditLead();
        setStep("done");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (step !== "book") return;

    if (!document.getElementById(CALENDLY_STYLESHEET_ID)) {
      const stylesheet = document.createElement("link");
      stylesheet.id = CALENDLY_STYLESHEET_ID;
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(stylesheet);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "book" || calendlyStatus !== "loading") return;

    const timeout = window.setTimeout(() => setCalendlyStatus("error"), 12_000);
    return () => window.clearTimeout(timeout);
  }, [calendlyStatus, step]);

  useEffect(() => {
    if (step !== "book" || calendlyStatus !== "ready" || !CALENDLY_URL) return;

    const el = embedRef.current;
    if (!el || el.hasChildNodes()) return;

    const calendly = window.Calendly;
    if (!calendly) return;

    const dark = document.documentElement.classList.contains("dark");
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      background_color: dark ? "1a1a19" : "ffffff",
      text_color: dark ? "ffffff" : "0a0a0a",
      primary_color: dark ? "ffffff" : "0a0a0a",
    });

    calendly.initInlineWidget({
      url: `${CALENDLY_URL}?${params.toString()}`,
      parentElement: el,
    });
  }, [calendlyStatus, step]);

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
        <Script
          id="calendly-widget-script"
          src="https://assets.calendly.com/assets/external/widget.js"
          onError={() => setCalendlyStatus("error")}
          onReady={() => setCalendlyStatus(window.Calendly ? "ready" : "error")}
        />
        <p className="mb-3 text-sm text-[var(--muted-text)]">
          Pick a time that works for you. It&rsquo;s a workflow fit call &mdash; bring one
          repeatable service.
        </p>
        <div className="relative h-[620px] w-full min-w-0 overflow-hidden rounded-2xl bg-[var(--field-bg)] sm:h-[700px]">
          <div ref={embedRef} className="h-full w-full" />
          {calendlyStatus === "loading" ? (
            <p
              className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-[var(--muted-text)]"
              role="status"
            >
              Loading available times…
            </p>
          ) : null}
          {calendlyStatus === "error" && CALENDLY_URL ? (
            <div
              className="absolute inset-0 grid place-items-center px-6 text-center"
              role="status"
            >
              <div>
                <p className="text-sm text-[var(--muted-text)]">
                  The scheduler did not load in this page.
                </p>
                <a
                  className="mt-4 inline-flex rounded-full bg-[var(--btn-bg)] px-5 py-3 font-display text-xs uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
                  href={CALENDLY_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open scheduling page
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        className="w-full rounded-full bg-[var(--btn-bg)] px-5 py-3 font-display text-sm uppercase tracking-wider text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!CALENDLY_URL}
        onClick={requestBookingOpen}
        type="button"
      >
        <span className="block">Build your workflow</span>
        {CALENDLY_URL ? (
          <span className="mt-0.5 block font-sans text-[0.68rem] normal-case tracking-normal opacity-70">
            Starts with a 30-minute workflow fit call
          </span>
        ) : null}
      </button>
      {!CALENDLY_URL && (
        <p className="mt-2 text-center text-sm text-[var(--muted-text)]" role="status">
          Booking is temporarily unavailable.
        </p>
      )}
      <button
        className="mt-3 w-full rounded-full border border-black/10 bg-white px-5 py-3.5 font-display text-sm uppercase tracking-wider text-black transition hover:bg-neutral-100"
        onClick={showHowItWorks}
        type="button"
      >
        See how it works
      </button>
    </div>
  );
}
