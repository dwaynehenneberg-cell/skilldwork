"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/app/theme-toggle";
import { DEMO_DOMAIN } from "@/lib/foerderklar/offers";
import { useI18n } from "@/lib/foerderklar/i18n";

export function LangSwitch() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="inline-flex rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5 text-xs font-semibold">
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
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}

export function TopBar({ compact }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[var(--page-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/sales/foerderklar" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--text)] text-xs font-bold tracking-wide text-[var(--page-bg)] ring-1 ring-[var(--logo-ring)]">
            FK
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {t.brand}
            </p>
            {!compact && (
              <p className="truncate text-xs text-[var(--muted-text)]">
                {DEMO_DOMAIN}
              </p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function PoweredBy() {
  const { t } = useI18n();
  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[var(--muted-text)]">
      <Image
        src="/logo-light.png"
        alt=""
        width={18}
        height={18}
        className="rounded-md dark:hidden"
      />
      <Image
        src="/logo.png"
        alt=""
        width={18}
        height={18}
        className="hidden rounded-md dark:block"
      />
      <span>{t.poweredBy}</span>
    </div>
  );
}

export function PortalChrome({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar compact />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="fk-rise mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
            {subtitle}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-[var(--text)] sm:text-4xl">
            {title}
          </h1>
        </div>
        {children}
        <PoweredBy />
      </main>
    </>
  );
}
