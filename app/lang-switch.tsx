"use client";

import { useLocaleStore } from "@/lib/use-locale-store";

/** Compact EN/DE control — shared by marketing site and FörderKlar demo. */
export default function LangSwitch() {
  const { locale, setLocale } = useLocaleStore();

  return (
    <div
      className="inline-flex rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {(["en", "de"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === code
              ? "bg-[var(--btn-bg)] text-[var(--btn-text)]"
              : "text-[var(--muted-text)] hover:text-[var(--text)]"
          }`}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
