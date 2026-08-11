"use client";

import Link from "next/link";
import { useState } from "react";
import { saveConsent, useConsent, type Consent } from "./consent";

export default function ConsentBanner() {
  const consent = useConsent();
  const [isEditing, setIsEditing] = useState(false);
  const isChoosing = consent === "unset" || isEditing;

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
            Allow optional Reddit and Meta measurement for visits and completed
            bookings.{" "}
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
