"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { STATES } from "@/lib/foerderklar/grants";
import { formatOfferPrice, getOffer, PROVIDER_PATH } from "@/lib/foerderklar/offers";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore, type OnboardingData } from "@/lib/foerderklar/store";
import { PortalChrome } from "./chrome";

export default function PortalPage() {
  const { t, offerCopy, locale } = useI18n();
  const { state, hydrated, saveOnboarding, startRun } = useStore();
  const router = useRouter();
  const offer = getOffer(state.offerId);
  const copy = offerCopy(offer.id);
  const price = formatOfferPrice(offer, locale);

  const [form, setForm] = useState<OnboardingData>(state.onboarding);

  useEffect(() => {
    if (hydrated) setForm(state.onboarding);
  }, [hydrated, state.onboarding]);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.cardConnected) router.replace(`${PROVIDER_PATH}/checkout`);
  }, [hydrated, state.cardConnected, router]);

  function set<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.companyName.trim()) return;
    saveOnboarding(form);
    startRun();
    router.push(`${PROVIDER_PATH}/workflow`);
  }

  if (!hydrated) {
    return (
      <PortalChrome title={t.portal.title} subtitle={t.portal.subtitle}>
        <div className="fk-card h-40 animate-pulse bg-[var(--fk-soft)]" />
      </PortalChrome>
    );
  }

  return (
    <PortalChrome title={t.portal.title} subtitle={t.portal.subtitle}>
      <div className="fk-rise mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--fk-line)] bg-[var(--fk-surface)] px-4 py-3 text-sm">
        <span className="rounded-full bg-[var(--workflow-accent)] px-2.5 py-1 text-xs font-bold text-[#0a0a0a]">
          {t.portal.offerBadge}
        </span>
        <span className="font-semibold text-[var(--text)]">{copy.name}</span>
        <span className="text-[var(--muted-text)]">{price}</span>
        {state.cardLast4 && (
          <span className="ml-auto text-xs text-[var(--muted-text)]">
            {t.checkout.connected} · •••• {state.cardLast4}
          </span>
        )}
      </div>

      <p className="fk-rise mb-5 text-[var(--muted-text)]" style={{ animationDelay: "40ms" }}>
        {t.portal.intro}
      </p>

      <form onSubmit={onSubmit} className="fk-card fk-rise space-y-4 p-5 sm:p-6" style={{ animationDelay: "80ms" }}>
        <Field label={t.portal.companyName}>
          <input
            className="fk-field"
            required
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.portal.industry}>
            <select
              className="fk-field"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            >
              {Object.entries(t.portal.industries).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.portal.size}>
            <select
              className="fk-field"
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
            >
              {Object.entries(t.portal.sizes).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.portal.state}>
            <select
              className="fk-field"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            >
              {STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.portal.legalForm}>
            <select
              className="fk-field"
              value={form.legalForm}
              onChange={(e) => set("legalForm", e.target.value)}
            >
              {Object.entries(t.portal.legalForms).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.portal.revenue}>
            <select
              className="fk-field"
              value={form.revenue}
              onChange={(e) => set("revenue", e.target.value)}
            >
              {Object.entries(t.portal.revenues).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.portal.goal}>
            <select
              className="fk-field"
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
            >
              {Object.entries(t.portal.goals).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <button type="submit" className="fk-btn fk-btn-dark w-full text-base">
          {t.portal.start}
        </button>
      </form>
    </PortalChrome>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="fk-label">{label}</label>
      {children}
    </div>
  );
}
