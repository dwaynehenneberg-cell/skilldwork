"use client";

import Link from "next/link";
import { useState } from "react";
import { saveConsent, useConsent, type Consent } from "./consent";
import { COPY, PRIVACY_PATH, type Locale } from "./copy";

export default function ConsentBanner({ locale }: { locale: Locale }) {
  const copy = COPY[locale].consent;
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
          aria-label={copy.label}
          className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-lg shadow-black/15 sm:left-3 sm:right-auto sm:w-[22rem]"
        >
          <p className="text-xs leading-5 text-[var(--muted-text)]">
            {copy.text}{" "}
            <Link
              href={PRIVACY_PATH[locale]}
              className="text-[var(--text)] underline underline-offset-4"
            >
              {copy.learnMore}
            </Link>
            .
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="flex-1 rounded-full border border-[var(--field-border)] px-3 py-2 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--field-bg)]"
              onClick={() => choose("declined")}
              type="button"
            >
              {copy.decline}
            </button>
            <button
              className="flex-1 rounded-full bg-[var(--btn-bg)] px-3 py-2 text-xs font-medium text-[var(--btn-text)] transition hover:bg-[var(--btn-hover)]"
              onClick={() => choose("accepted")}
              type="button"
            >
              {copy.accept}
            </button>
          </div>
        </aside>
      ) : (
        <button
          className="fixed bottom-3 left-3 z-40 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs text-[var(--muted-text)] shadow-lg transition hover:text-[var(--text)]"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          {copy.reopen}
        </button>
      )}
    </>
  );
}
