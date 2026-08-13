"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { formatOfferPrice, getOffer, PROVIDER_PATH } from "@/lib/foerderklar/offers";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";
import { PortalChrome } from "./chrome";

export default function CheckoutPage() {
  const { t, offerCopy, locale } = useI18n();
  const { state, completeCheckout } = useStore();
  const offer = getOffer(state.offerId);
  const copy = offerCopy(offer.id);
  const price = formatOfferPrice(offer, locale);
  const router = useRouter();

  const [email, setEmail] = useState(state.email);
  const [company, setCompany] = useState(state.checkoutCompany);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const last4 = useMemo(() => card.replace(/\D/g, "").slice(-4) || "4242", [card]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !company || !name) return;
    setBusy(true);
    completeCheckout({ email, company, last4 });
    window.setTimeout(() => {
      router.push(`${PROVIDER_PATH}/portal`);
    }, 450);
  }

  return (
    <PortalChrome title={t.checkout.title} subtitle={t.brand}>
      <Link
        href={`${PROVIDER_PATH}#offers`}
        className="mb-5 inline-block text-sm font-semibold text-[var(--workflow-blue)] hover:underline"
      >
        ← {t.checkout.back}
      </Link>

      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <aside className="fk-card fk-rise p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fk-muted)]">
            {t.checkout.order}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{copy.name}</h2>
          <p className="mt-1 text-sm text-[var(--fk-muted)]">{copy.tagline}</p>
          <p className="mt-4 text-3xl font-bold">{price}</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--fk-muted)]">
            {copy.bullets.slice(0, 3).map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--fk-blue)]" />
                {b}
              </li>
            ))}
          </ul>
        </aside>

        <form onSubmit={onSubmit} className="fk-card fk-rise space-y-4 p-5 sm:p-6" style={{ animationDelay: "70ms" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fk-muted)]">
            {t.checkout.pay}
          </p>

          <div>
            <label className="fk-label" htmlFor="email">
              {t.checkout.email}
            </label>
            <input
              id="email"
              className="fk-field"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.de"
            />
          </div>

          <div>
            <label className="fk-label" htmlFor="company">
              {t.checkout.company}
            </label>
            <input
              id="company"
              className="fk-field"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme GmbH"
            />
          </div>

          <div>
            <label className="fk-label" htmlFor="card">
              {t.checkout.cardLabel}
            </label>
            <input
              id="card"
              className="fk-field font-mono"
              required
              value={card}
              onChange={(e) => setCard(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fk-label" htmlFor="expiry">
                {t.checkout.expiry}
              </label>
              <input
                id="expiry"
                className="fk-field font-mono"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            <div>
              <label className="fk-label" htmlFor="cvc">
                {t.checkout.cvc}
              </label>
              <input
                id="cvc"
                className="fk-field font-mono"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="fk-label" htmlFor="name">
              {t.checkout.nameOnCard}
            </label>
            <input
              id="name"
              className="fk-field"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <p className="text-xs text-[var(--fk-muted)]">{t.checkout.secure}</p>

          <button
            type="submit"
            disabled={busy}
            className="fk-btn fk-btn-dark w-full disabled:opacity-60"
          >
            {busy ? "…" : t.checkout.connect}
          </button>
        </form>
      </div>
    </PortalChrome>
  );
}
