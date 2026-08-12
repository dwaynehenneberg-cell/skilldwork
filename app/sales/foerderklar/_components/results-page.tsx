"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { matchGrants } from "@/lib/foerderklar/grants";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";
import { ChatPanel } from "./chat-panel";
import { PortalChrome } from "./chrome";

export default function ResultsPage() {
  const { t, locale } = useI18n();
  const { state, hydrated, requestRevision, acceptResult, reset } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.onboardingComplete) {
      router.replace("/sales/foerderklar/portal");
      return;
    }
    if (state.runStatus === "running") {
      router.replace("/sales/foerderklar/workflow");
    }
  }, [hydrated, state.onboardingComplete, state.runStatus, router]);

  const grants = useMemo(
    () => matchGrants(state.onboarding, state.revisionNote, state.runSeed),
    [state.onboarding, state.revisionNote, state.runSeed],
  );

  function onRevise(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    const attachmentNote =
      files.length > 0
        ? `\n\n[${t.results.attachments}: ${files.join(", ")}]`
        : "";
    requestRevision(`${note.trim()}${attachmentNote}`);
    setOpen(false);
    setNote("");
    setFiles([]);
    router.push("/sales/foerderklar/workflow");
  }

  if (!hydrated) {
    return (
      <PortalChrome title={t.results.title} subtitle={t.results.subtitle}>
        <div className="fk-card h-48 animate-pulse bg-[var(--fk-soft)]" />
      </PortalChrome>
    );
  }

  if (state.runStatus === "accepted") {
    return (
      <PortalChrome title={t.results.accepted} subtitle={t.results.subtitle}>
        <div className="fk-card fk-rise p-6 sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--workflow-blue)] text-2xl text-white">
            ✓
          </div>
          <p className="mx-auto mt-5 max-w-md text-center text-[var(--muted-text)]">
            {t.results.acceptedBody}
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2">
            <Link href="/account" className="fk-btn fk-btn-dark">
              {t.results.accountCta}
            </Link>
            <button
              type="button"
              className="fk-btn fk-btn-ghost"
              onClick={() => setChatOpen(true)}
            >
              {t.results.askQuestion}
            </button>
            <button
              type="button"
              className="fk-btn fk-btn-ghost"
              onClick={() => {
                reset();
                router.push("/sales/foerderklar");
              }}
            >
              {t.results.again}
            </button>
          </div>
        </div>
        <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />
      </PortalChrome>
    );
  }

  return (
    <PortalChrome title={t.results.title} subtitle={t.results.subtitle}>
      <p className="fk-rise mb-4 text-sm text-[var(--muted-text)]">
        {t.results.basedOn}{" "}
        <strong className="text-[var(--text)]">
          {state.onboarding.companyName}
        </strong>
        {" · "}
        {t.portal.industries[
          state.onboarding.industry as keyof typeof t.portal.industries
        ] ?? state.onboarding.industry}
        {" · "}
        {state.onboarding.size} {t.results.employees}
        {state.revisionCount > 0 ? (
          <>
            {" · "}
            <span className="text-[var(--workflow-blue)]">
              revision #{state.revisionCount}
            </span>
          </>
        ) : null}
      </p>

      <div className="space-y-3">
        {grants.map((g, i) => {
          const started = state.applications.some((a) => a.grantId === g.id);
          return (
            <article
              key={g.id}
              className="fk-card fk-rise p-4 sm:p-5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {locale === "de" ? g.nameDe : g.name}
                  </h2>
                  <p className="text-xs text-[var(--muted-text)]">{g.program}</p>
                </div>
                <div className="rounded-full bg-[var(--fk-blue-soft)] px-3 py-1 text-sm font-bold text-[var(--workflow-blue)]">
                  {t.results.fit} {g.fit}%
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <Stat label={t.results.amount} value={g.amount} />
                <Stat label={t.results.deadline} value={g.deadline} />
                <Stat
                  label={t.results.next}
                  value={locale === "de" ? g.nextDe : g.nextEn}
                />
              </div>
              <div className="mt-4">
                {started ? (
                  <span className="inline-flex rounded-xl bg-[var(--field-bg)] px-3 py-2 text-sm font-semibold text-[var(--workflow-blue)] ring-1 ring-[var(--card-border)]">
                    {t.results.startActionDone}
                  </span>
                ) : (
                  <Link
                    href={`/sales/foerderklar/apply/${g.id}`}
                    className="fk-btn fk-btn-dark text-sm"
                  >
                    {t.results.startAction}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="fk-btn fk-btn-ghost"
          onClick={() => setOpen(true)}
        >
          {t.results.revise}
        </button>
        <button
          type="button"
          className="fk-btn fk-btn-dark"
          onClick={() => acceptResult()}
        >
          {t.results.accept}
        </button>
      </div>
      <button
        type="button"
        className="fk-btn fk-btn-ghost mt-2 w-full"
        onClick={() => setChatOpen(true)}
      >
        {t.results.askQuestion}
      </button>
      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <form
            onSubmit={onRevise}
            className="fk-card w-full max-w-lg p-5 sm:p-6"
          >
            <h3 className="text-lg font-semibold text-[var(--text)]">
              {t.results.revisionTitle}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              {t.results.revisionHint}
            </p>
            <textarea
              className="fk-field mt-4 min-h-28 resize-y"
              placeholder={t.results.revisionPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />

            <label className="mt-3 flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3 text-sm">
              <span className="font-semibold text-[var(--text)]">
                {t.results.attach}
              </span>
              <span className="text-xs text-[var(--muted-text)]">
                {t.results.attachHint}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                className="mt-1 text-xs text-[var(--muted-text)]"
                onChange={(e) => {
                  const list = Array.from(e.target.files ?? []).map((f) => f.name);
                  setFiles(list);
                }}
              />
            </label>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-[var(--muted-text)]">
                {files.map((name) => (
                  <li key={name}>· {name}</li>
                ))}
              </ul>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="fk-btn fk-btn-ghost"
                onClick={() => {
                  setOpen(false);
                  setFiles([]);
                }}
              >
                {t.results.cancel}
              </button>
              <button type="submit" className="fk-btn fk-btn-dark">
                {t.results.submitRevision}
              </button>
            </div>
          </form>
        </div>
      )}
    </PortalChrome>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--field-bg)] px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-text)]">
        {label}
      </p>
      <p className="mt-1 font-medium leading-snug text-[var(--text)]">{value}</p>
    </div>
  );
}
