"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEMO_DOMAIN,
  OFFERS,
  PROVIDER_PATH,
  SALES_VIDEO_URL,
  formatOfferPrice,
  formatRevisions,
  type OfferId,
} from "@/lib/foerderklar/offers";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";
import { ContactPanel } from "./contact-panel";
import { PoweredBy, TopBar } from "./chrome";

type MediaItem = {
  id: string;
  kind: "video" | "image";
  label: string;
  src: string;
};

export default function SalesPage() {
  const { t, offerCopy, locale } = useI18n();
  const { state, selectOffer } = useStore();
  const router = useRouter();
  const selected = state.offerId;
  const [tab, setTab] = useState<"about" | "offers">("about");
  const [mediaIndex, setMediaIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const media = useMemo<MediaItem[]>(
    () => [
      {
        id: "video",
        kind: "video",
        label: t.sales.mediaVideo,
        src: "/foerderklar/media-video-cover.png",
      },
      {
        id: "sample",
        kind: "image",
        label: t.sales.mediaSample,
        src: "/foerderklar/media-sample.png",
      },
      {
        id: "process",
        kind: "image",
        label: t.sales.mediaProcess,
        src: "/foerderklar/media-process.png",
      },
      {
        id: "industries",
        kind: "image",
        label: t.sales.mediaIndustries,
        src: "/foerderklar/media-industries.png",
      },
      {
        id: "deliverable",
        kind: "image",
        label: t.sales.mediaDeliverable,
        src: "/foerderklar/media-deliverable.png",
      },
    ],
    [t],
  );

  const activeMedia = media[mediaIndex] ?? media[0];

  function goCheckout(id?: OfferId) {
    if (id) selectOffer(id);
    router.push(`${PROVIDER_PATH}/checkout`);
  }

  function priceLabel(offerId: OfferId) {
    return formatOfferPrice(OFFERS.find((o) => o.id === offerId)!, locale);
  }

  function selectMedia(index: number) {
    setMediaIndex(index);
    setVideoPlaying(false);
  }

  return (
    <>
      <TopBar />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8 lg:px-6 lg:py-10">
        <section className="fk-card fk-rise overflow-hidden">
          <div className="border-b border-[var(--card-border)] px-5 py-5 sm:px-7 sm:py-6">
            <h1 className="font-display text-3xl leading-[1.08] tracking-tight text-[var(--text)] sm:text-4xl">
              {t.sales.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted-text)]">
              <Meta icon="lock">{t.sales.private}</Meta>
              <Meta icon="users">{t.sales.clients}</Meta>
              <Meta icon="tag">{t.sales.fromPrice}</Meta>
              <span className="inline-flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--workflow-accent),var(--workflow-blue))]" />
                {t.sales.by} {t.sales.provider}
              </span>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--text)] sm:aspect-[16/9]">
              {activeMedia.kind === "video" && videoPlaying ? (
                <video
                  src={SALES_VIDEO_URL}
                  poster={activeMedia.src}
                  className="absolute inset-0 h-full w-full object-contain"
                  aria-label={activeMedia.label}
                  autoPlay
                  playsInline
                  preload="auto"
                  onEnded={() => setVideoPlaying(false)}
                />
              ) : (
                <>
                  <Image
                    src={activeMedia.src}
                    alt={activeMedia.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 720px"
                    priority
                  />
                  {activeMedia.kind === "video" && (
                    <button
                      type="button"
                      onClick={() => setVideoPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition hover:bg-black/30"
                      aria-label={t.sales.videoPlay}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[var(--text)] shadow-lg">
                        <svg
                          viewBox="0 0 24 24"
                          className="ml-1 h-7 w-7 fill-current"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {media.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectMedia(i)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                    i === mediaIndex
                      ? "border-[var(--text)] ring-2 ring-[var(--text)]"
                      : "border-[var(--card-border)] opacity-80 hover:opacity-100"
                  }`}
                  aria-label={item.label}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  {item.kind === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[10px] text-black">
                        ▶
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1 border-y border-[var(--card-border)] px-4 sm:px-6">
            {(
              [
                ["about", t.sales.aboutTab],
                ["offers", t.sales.offersTab],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative px-3 py-3 text-sm font-semibold transition ${
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

          {tab === "about" ? (
            <div className="space-y-8 px-5 py-6 sm:px-7 sm:py-8">
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {t.sales.aboutHeading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
                  {t.sales.aboutBody}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {t.sales.getTitle}
                </h2>
                <ul className="mt-3 space-y-2">
                  {t.sales.get.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--text)]">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {t.sales.whyTitle}
                </h2>
                <ul className="mt-3 space-y-2">
                  {t.sales.why.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--text)]">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {t.sales.processTitle}
                </h2>
                <ol className="mt-3 space-y-3">
                  {t.sales.process.map((item, i) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--text)]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--field-bg)] text-xs font-bold ring-1 ring-[var(--card-border)]">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {t.sales.faqTitle}
                </h2>
                <div className="mt-3 space-y-3">
                  {t.sales.faq.map((item) => (
                    <div
                      key={item.q}
                      className="rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[var(--text)]">{item.q}</p>
                      <p className="mt-1 text-sm text-[var(--muted-text)]">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-4 px-5 py-6 sm:px-7 sm:py-8">
              <p className="text-sm text-[var(--muted-text)]">{t.sales.subtitle}</p>
              {OFFERS.map((offer, index) => {
                const copy = offerCopy(offer.id);
                const active = selected === offer.id;
                return (
                  <article
                    key={offer.id}
                    className={`rounded-2xl border p-5 ${
                      active
                        ? "border-[var(--text)] bg-[var(--field-bg)]"
                        : "border-[var(--card-border)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted-text)]">
                          Package {index + 1}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-[var(--text)]">
                          {copy.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted-text)]">
                          {copy.tagline}
                        </p>
                      </div>
                      <p className="text-right text-2xl font-bold text-[var(--text)]">
                        {priceLabel(offer.id)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-[var(--muted-text)]">{copy.desc}</p>
                    <ul className="mt-3 space-y-2">
                      {copy.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-[var(--text)]">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--workflow-blue)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => selectOffer(offer.id)}
                      className="fk-btn fk-btn-ghost mt-4 w-full text-sm"
                    >
                      {active ? t.sales.offerSelected : t.sales.chooseOffer}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside
          className="fk-rise lg:sticky lg:top-20"
          style={{ animationDelay: "80ms" }}
        >
          <div className="fk-card overflow-hidden">
            <div className="relative h-36 bg-[var(--text)] px-5 py-5 text-[var(--page-bg)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--workflow-accent)_40%,transparent),transparent_45%),radial-gradient(circle_at_80%_70%,color-mix(in_srgb,var(--workflow-blue)_50%,transparent),transparent_50%)]" />
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                  {t.brand}
                </p>
                <p className="mt-2 max-w-[15rem] font-display text-2xl leading-[1.05] tracking-tight">
                  {locale === "de"
                    ? "FÖRDERUNG, DIE PASST."
                    : "FUNDING THAT FITS."}
                </p>
              </div>
            </div>

            <div className="px-5 py-5">
              <h2 className="text-lg font-semibold text-[var(--text)]">{t.brand}</h2>
              <p className="text-xs text-[var(--muted-text)]">{DEMO_DOMAIN}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
                {t.sales.sidebarBlurb}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[var(--card-border)] py-3 text-center">
                {[
                  [t.sales.statsClientsVal, t.sales.statsClients],
                  [t.sales.statsAvgVal, t.sales.statsAvg],
                  [t.sales.statsDaysVal, t.sales.statsDays],
                ].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-sm font-bold text-[var(--text)]">{val}</p>
                    <p className="text-[11px] text-[var(--muted-text)]">{label}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                {t.sales.chooseOffer}
              </p>
              <div className="mt-2 space-y-2">
                {OFFERS.map((offer) => {
                  const copy = offerCopy(offer.id);
                  const active = selected === offer.id;
                  return (
                    <button
                      key={offer.id}
                      type="button"
                      onClick={() => selectOffer(offer.id)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-[var(--text)] bg-[var(--field-bg)]"
                          : "border-[var(--card-border)] hover:border-[color-mix(in_srgb,var(--text)_35%,transparent)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {copy.name}
                          </p>
                          <p className="text-xs text-[var(--muted-text)]">
                            {t.offers.oneTime} · {offer.deliveryDays}{" "}
                            {t.offers.days} ·{" "}
                            {formatRevisions(
                              offer,
                              t.offers.unlimitedRevisions,
                              t.offers.revisions,
                            )}
                          </p>
                        </div>
                        <p className="text-right text-sm font-bold text-[var(--text)]">
                          {priceLabel(offer.id)}
                        </p>
                      </div>
                      {active && (
                        <p className="mt-1 text-[11px] font-semibold text-[var(--workflow-blue)]">
                          {t.sales.offerSelected}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goCheckout()}
                className="fk-btn fk-btn-cta mt-4 w-full text-sm uppercase tracking-wide"
              >
                {selected === "apply" ? t.sales.ctaApply : t.sales.ctaCheck}
              </button>
              <div className="mt-2">
                <ContactPanel />
              </div>
              <p className="mt-3 text-center text-[11px] text-[var(--muted-text)]">
                {t.sales.priceNote}
              </p>
              <PoweredBy />
            </div>
          </div>

          <div className="fk-card mt-4 p-5">
            <h3 className="font-display text-xl tracking-tight text-[var(--text)]">
              {t.sales.howTitle}
            </h3>
            <ol className="mt-4 space-y-3">
              {[
                [t.sales.how1Title, t.sales.how1Body],
                [t.sales.how2Title, t.sales.how2Body],
                [t.sales.how3Title, t.sales.how3Body],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--text)] text-xs font-bold text-[var(--page-bg)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
                    <p className="text-xs text-[var(--muted-text)]">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              href="/account"
              className="mt-4 inline-block text-sm font-semibold text-[var(--workflow-blue)] hover:underline"
            >
              skilldwork account →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--workflow-blue)_18%,transparent)] text-[11px] font-bold text-[var(--workflow-blue)]">
      ✓
    </span>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: "lock" | "users" | "tag";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-3.5 w-3.5"
      >
        {icon === "lock" && (
          <>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </>
        )}
        {icon === "users" && (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="3" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.74" />
          </>
        )}
        {icon === "tag" && (
          <>
            <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8.59-8.59a1 1 0 0 0 0-1.41L12 2z" />
            <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
          </>
        )}
      </svg>
      {children}
    </span>
  );
}
