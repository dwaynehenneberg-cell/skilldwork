"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeToggle from "@/app/theme-toggle";
import LangSwitch from "@/app/lang-switch";
import SiteLogo from "@/app/site-logo";
import { formatOfferPrice, getOffer } from "@/lib/foerderklar/offers";
import { I18nProvider, useI18n } from "@/lib/foerderklar/i18n";
import { StoreProvider, useStore } from "@/lib/foerderklar/store";
import { ChatPanel } from "@/app/sales/foerderklar/_components/chat-panel";
import "@/app/sales/foerderklar/foerderklar.css";

type Tab = "orders" | "messages" | "payments" | "profile";

export default function AccountPage() {
  return (
    <I18nProvider>
      <StoreProvider>
        <div className="fk-shell min-h-screen">
          <AccountInner />
        </div>
      </StoreProvider>
    </I18nProvider>
  );
}

function AccountInner() {
  const { t, offerCopy, locale } = useI18n();
  const { state, hydrated } = useStore();
  const [tab, setTab] = useState<Tab>("orders");
  const offer = getOffer(state.offerId);
  const copy = offerCopy(offer.id);

  const hasOrder = state.cardConnected || state.onboardingComplete;
  const isOpen =
    hasOrder && state.runStatus !== "accepted" && state.runStatus !== "idle";
  const isCompleted = hasOrder && state.runStatus === "accepted";
  // Checked out but not started yet still counts as open
  const isPendingStart =
    hasOrder && state.runStatus === "idle" && state.cardConnected;

  const price = formatOfferPrice(offer, locale, t.sales.customPrice);
  const statusLabel = useMemo(() => {
    if (!hasOrder) return t.account.statuses.idle;
    return t.account.statuses[state.runStatus] ?? state.runStatus;
  }, [hasOrder, state.runStatus, t]);

  const orderHref =
    state.runStatus === "ready" || state.runStatus === "accepted"
      ? "/sales/foerderklar/results"
      : state.runStatus === "running"
        ? "/sales/foerderklar/workflow"
        : "/sales/foerderklar/portal";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[var(--page-bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <SiteLogo href={false} size={36} />
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {t.account.title}
              </p>
              <p className="text-xs text-[var(--muted-text)]">{t.account.subtitle}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--workflow-accent)] px-2.5 py-1 text-[11px] font-bold text-[#0a0a0a]">
              {t.account.demoBadge}
            </span>
            <LangSwitch />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="fk-card overflow-hidden">
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--card-border)] px-3 pt-2 sm:px-4">
            {(
              [
                ["orders", t.account.orders],
                ["messages", t.account.messages],
                ["payments", t.account.payments],
                ["profile", t.account.profile],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative shrink-0 px-3 py-3 text-sm font-semibold transition ${
                  tab === id
                    ? "text-[var(--text)]"
                    : "text-[var(--muted-text)] hover:text-[var(--text)]"
                }`}
              >
                {label}
                {tab === id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--text)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {!hydrated ? (
              <div className="h-32 animate-pulse rounded-2xl bg-[var(--field-bg)]" />
            ) : tab === "orders" ? (
              !hasOrder ? (
                <Empty
                  text={t.account.noOrders}
                  cta={t.account.backToService}
                  href="/sales/foerderklar"
                />
              ) : (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                      {t.account.openOrders}
                    </h2>
                    {isOpen || isPendingStart ? (
                      <OrderCard
                        brand={t.brand}
                        name={copy.name}
                        company={
                          state.checkoutCompany ||
                          state.onboarding.companyName ||
                          "—"
                        }
                        price={price}
                        status={statusLabel}
                        href={orderHref}
                        cta={t.account.openService}
                        apps={state.applications.length}
                        appsLabel={t.results.startActionDone}
                      />
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted-text)]">
                        {t.account.noOpen}
                      </p>
                    )}
                  </section>
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                      {t.account.completedOrders}
                    </h2>
                    {isCompleted ? (
                      <OrderCard
                        brand={t.brand}
                        name={copy.name}
                        company={
                          state.checkoutCompany ||
                          state.onboarding.companyName ||
                          "—"
                        }
                        price={price}
                        status={statusLabel}
                        href="/sales/foerderklar/results"
                        cta={t.account.openService}
                        apps={state.applications.length}
                        appsLabel={t.results.startActionDone}
                      />
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted-text)]">
                        {t.account.noCompleted}
                      </p>
                    )}
                  </section>
                </div>
              )
            ) : tab === "messages" ? (
              <ChatPanel embedded />
            ) : tab === "payments" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {t.account.addCard}
                    </p>
                    <p className="text-sm text-[var(--muted-text)]">
                      {state.cardLast4
                        ? `•••• •••• •••• ${state.cardLast4}`
                        : "Visa •••• 4242"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--text)] px-2.5 py-1 text-[11px] font-bold text-[var(--page-bg)]">
                    Default
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-text)]">
                  {t.checkout.secure}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <Row
                  label={t.account.name}
                  value={state.checkoutCompany || "Demo Client"}
                />
                <Row
                  label={t.account.email}
                  value={state.email || "demo@company.de"}
                />
                <Row
                  label={t.account.company}
                  value={
                    state.onboarding.companyName ||
                    state.checkoutCompany ||
                    "—"
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/sales/foerderklar"
            className="text-sm font-semibold text-[var(--workflow-blue)] hover:underline"
          >
            ← {t.account.backToService}
          </Link>
        </div>
      </main>
    </>
  );
}

function OrderCard({
  brand,
  name,
  company,
  price,
  status,
  href,
  cta,
  apps,
  appsLabel,
}: {
  brand: string;
  name: string;
  company: string;
  price: string;
  status: string;
  href: string;
  cta: string;
  apps: number;
  appsLabel: string;
}) {
  return (
    <article className="mt-3 rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
            {brand}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">{name}</h3>
          <p className="mt-1 text-sm text-[var(--muted-text)]">{company}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--text)]">{price}</p>
          <p className="text-xs font-semibold text-[var(--workflow-blue)]">
            {status}
          </p>
        </div>
      </div>
      {apps > 0 && (
        <p className="mt-3 text-xs text-[var(--muted-text)]">
          {appsLabel}: {apps}
        </p>
      )}
      <Link href={href} className="fk-btn fk-btn-dark mt-4 inline-flex text-sm">
        {cta}
      </Link>
    </article>
  );
}

function Empty({
  text,
  cta,
  href,
}: {
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--card-border)] px-4 py-10 text-center">
      <p className="text-sm text-[var(--muted-text)]">{text}</p>
      <Link href={href} className="fk-btn fk-btn-cta mt-4 inline-flex text-sm">
        {cta}
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3">
      <span className="text-[var(--muted-text)]">{label}</span>
      <span className="font-semibold text-[var(--text)]">{value}</span>
    </div>
  );
}
