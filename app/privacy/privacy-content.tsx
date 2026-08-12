"use client";

import Link from "next/link";
import SiteControls from "../site-controls";
import { useSiteI18n } from "@/lib/site-i18n";

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";
const linkClass =
  "text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 transition-opacity hover:opacity-65";

function AddressBlock({ text }: { text: string }) {
  const [name, emailLine] = text.split("\n");
  const email = emailLine?.replace(/^Email:\s*/i, "").replace(/^E-Mail:\s*/i, "") ?? "";
  return (
    <address className="not-italic leading-7">
      {name}
      <br />
      {emailLine?.startsWith("E-Mail") ? "E-Mail" : "Email"}:{" "}
      <a href={`mailto:${email}`} className={linkClass}>
        {email}
      </a>
    </address>
  );
}

export default function PrivacyContent() {
  const { t } = useSiteI18n();
  const { privacy, nav } = t;

  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 pb-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--text)] transition-opacity hover:opacity-65"
        >
          skilldwork
        </Link>
        <SiteControls />
      </div>

      <article className="mx-auto w-full max-w-3xl space-y-9 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--muted-text)] shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
        <header className="space-y-3 border-b border-[var(--card-border)] pb-7">
          <p className="text-sm font-medium uppercase tracking-[0.16em]">Skilldwork</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
            {privacy.title}
          </h1>
          <p className="max-w-2xl leading-7">{privacy.intro}</p>
        </header>

        {privacy.sections.map((section) => (
          <section key={section.title} className={sectionClass}>
            <h2 className={headingClass}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) =>
              section.title.startsWith("1.") && index === 0 ? (
                <AddressBlock key={index} text={paragraph} />
              ) : section.title.startsWith("4.") && index === 0 ? (
                <p key={index} className="leading-7">
                  {paragraph.includes("Meta") ? (
                    <>
                      {paragraph.split(/(Meta|Reddit|Calendly|Vercel)/).map((part, i) => {
                        const href =
                          part === "Meta"
                            ? "https://www.facebook.com/privacy/policy/"
                            : part === "Reddit"
                              ? "https://www.reddit.com/policies/privacy-policy"
                              : part === "Calendly"
                                ? "https://calendly.com/legal/privacy-notice"
                                : part === "Vercel"
                                  ? "https://vercel.com/legal/privacy-notice"
                                  : null;
                        return href ? (
                          <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className={linkClass}
                          >
                            {part}
                          </a>
                        ) : (
                          <span key={i}>{part}</span>
                        );
                      })}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ) : (
                <p key={index} className="leading-7">
                  {paragraph}
                </p>
              ),
            )}
          </section>
        ))}

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">{privacy.updated}</p>
      </article>

      <footer className="mx-auto mt-8 flex max-w-3xl justify-center gap-4 pb-4 text-center">
        <Link
          href="/agb"
          className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
        >
          {nav.agb}
        </Link>
        <Link
          href="/pricing"
          className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
        >
          {nav.pricing}
        </Link>
      </footer>
    </main>
  );
}
