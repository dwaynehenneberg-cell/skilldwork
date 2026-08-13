"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { matchGrants } from "@/lib/foerderklar/grants";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";
import { PortalChrome } from "./chrome";

export default function ApplyPage({ grantId }: { grantId: string }) {
  const { t, locale } = useI18n();
  const { state, hydrated, submitApplication } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const grant = useMemo(() => {
    const list = matchGrants(
      state.onboarding,
      state.revisionNote,
      state.runSeed,
    );
    return list.find((g) => g.id === grantId) ?? null;
  }, [grantId, state.onboarding, state.revisionNote, state.runSeed]);

  const existing = state.applications.find((a) => a.grantId === grantId);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.onboardingComplete || state.runStatus === "idle") {
      router.replace("/sales/foerderklar/results");
    }
  }, [hydrated, state.onboardingComplete, state.runStatus, router]);

  useEffect(() => {
    if (hydrated) setEmail(state.email || "");
  }, [hydrated, state.email]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!grant || !email.trim()) return;
    const name = locale === "de" ? grant.nameDe : grant.name;
    submitApplication({
      grantId: grant.id,
      grantName: name,
      contactEmail: email.trim(),
      note: note.trim(),
    });
    setDone(true);
  }

  if (!hydrated) {
    return (
      <PortalChrome title={t.apply.title} subtitle={t.apply.subtitle}>
        <div className="fk-card h-40 animate-pulse bg-[var(--fk-soft)]" />
      </PortalChrome>
    );
  }

  if (!grant) {
    return (
      <PortalChrome title={t.apply.title} subtitle={t.apply.subtitle}>
        <p className="text-sm text-[var(--muted-text)]">{t.apply.back}</p>
        <Link
          href="/sales/foerderklar/results"
          className="fk-btn fk-btn-dark mt-4 inline-flex"
        >
          {t.apply.back}
        </Link>
      </PortalChrome>
    );
  }

  const grantName = locale === "de" ? grant.nameDe : grant.name;

  if (done || existing) {
    return (
      <PortalChrome title={t.apply.successTitle} subtitle={t.apply.subtitle}>
        <div className="fk-card p-6">
          <p className="text-lg font-semibold text-[var(--text)]">{grantName}</p>
          <p className="mt-2 text-sm text-[var(--muted-text)]">
            {existing && !done ? t.apply.already : t.apply.successBody}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link href="/sales/foerderklar/results" className="fk-btn fk-btn-dark">
              {t.apply.back}
            </Link>
            <Link href="/account" className="fk-btn fk-btn-ghost">
              {t.results.accountCta}
            </Link>
          </div>
        </div>
      </PortalChrome>
    );
  }

  return (
    <PortalChrome title={t.apply.title} subtitle={t.apply.subtitle}>
      <div className="fk-card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
          {grant.program}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
          {grantName}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-text)]">{t.apply.intro}</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="fk-label" htmlFor="apply-email">
              {t.apply.email}
            </label>
            <input
              id="apply-email"
              type="email"
              required
              className="fk-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="fk-label" htmlFor="apply-note">
              {t.apply.note}
            </label>
            <textarea
              id="apply-note"
              className="fk-field min-h-28 resize-y"
              placeholder={t.apply.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button type="submit" className="fk-btn fk-btn-dark w-full">
            {t.apply.submit}
          </button>
        </form>
      </div>
    </PortalChrome>
  );
}
