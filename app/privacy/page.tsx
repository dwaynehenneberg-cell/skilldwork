import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";

export const metadata: Metadata = {
  title: "Privacy | Skilldwork",
  description: "Privacy notice for Skilldwork Meta lead forms.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between pb-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--text)] transition-opacity hover:opacity-65"
        >
          skilldwork
        </Link>
        <ThemeToggle />
      </div>

      <article className="mx-auto w-full max-w-3xl space-y-9 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--muted-text)] shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
        <header className="space-y-3 border-b border-[var(--card-border)] pb-7">
          <p className="text-sm font-medium uppercase tracking-[0.16em]">Skilldwork</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
            Privacy
          </h1>
          <p className="max-w-2xl leading-7">
            This notice applies to contact details you submit through a lead form on Facebook or
            Instagram.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Controller</h2>
          <address className="not-italic leading-7">
            Dwayne Henneberg (Skilldwork)
            <br />
            Email:{" "}
            <a
              href="mailto:hello@skilldwork.com"
              className="text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 hover:opacity-65"
            >
              hello@skilldwork.com
            </a>
          </address>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Data we process</h2>
          <p className="leading-7">
            When you submit our Meta lead form, we receive and process the phone number you
            provide. Meta also processes data under its own{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 hover:opacity-65"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Purpose and legal basis</h2>
          <p className="leading-7">
            We use your phone number only to contact you about the offer described in the ad and
            to respond to your request. Processing is based on your voluntary consent under Art.
            6(1)(a) GDPR. You may withdraw your consent at any time with effect for the future by
            emailing us.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Recipients and retention</h2>
          <p className="leading-7">
            We do not share your phone number with third parties for advertising purposes. We
            retain it only for as long as necessary to contact you and handle your request. We
            delete it when you withdraw your consent or the purpose no longer applies, unless a
            legal retention obligation requires otherwise.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Your rights</h2>
          <p className="leading-7">
            Subject to the legal requirements, you have the right to access, correct, erase,
            restrict the processing of, and receive a copy of your data. You may also withdraw
            your consent and lodge a complaint with a competent data protection authority. To
            exercise your rights, email the address above.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Voluntary submission</h2>
          <p className="leading-7">
            Providing your phone number is voluntary. Without it, we cannot contact you by phone.
            Skilldwork does not use automated decision-making or profiling for this purpose.
          </p>
        </section>

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">
          Last updated: August 10, 2026
        </p>
      </article>
    </main>
  );
}
