import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../../theme-toggle";

export const metadata: Metadata = {
  title: "Privacy | Skilldwork",
  description: "Privacy notice for Skilldwork contact requests and bookings.",
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold tracking-tight text-[var(--text)]";
const linkClass =
  "text-[var(--text)] underline decoration-[var(--field-border-focus)] underline-offset-4 transition-opacity hover:opacity-65";

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
            This notice explains how Skilldwork handles personal data you provide through our
            website, a lead form on Facebook, Instagram or Reddit, or our Calendly booking link.
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
              className={linkClass}
            >
              hello@skilldwork.com
            </a>
          </address>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Data we process</h2>
          <p className="leading-7">
            Depending on how you contact us, we may process your name, email address, phone
            number, company or role, message, appointment details, and any other information you
            choose to provide. When you visit our website, limited technical data such as your IP
            address, browser or device information, requested page, and date and time may also be
            processed to deliver the site securely.
          </p>
          <p className="leading-7">
            If you allow advertising measurement, the Reddit Pixel and the Meta Pixel also
            process information about page visits and completed bookings, together with online
            identifiers and device or browser information, so we can measure whether an
            advertisement led to a booking.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. How and why we use your data</h2>
          <p className="leading-7">
            We use your data to respond to your inquiry, contact you about the offer you requested,
            schedule and manage a call, and prepare any requested services. Processing is based on
            steps you ask us to take before entering into a contract (Art. 6(1)(b) GDPR), or on
            your consent where a form specifically requests it (Art. 6(1)(a) GDPR). We process
            limited technical website data based on our legitimate interest in providing a secure
            and reliable website (Art. 6(1)(f) GDPR). Reddit advertising measurement is activated
            only with your consent (Art. 6(1)(a) GDPR). You may change that choice at any time via
            “Privacy choices” or withdraw consent by emailing us.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Platforms and service providers</h2>
          <p className="leading-7">
            The provider of the channel you use may process your data to operate its service. This
            may include{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Meta
            </a>
            ,{" "}
            <a
              href="https://www.reddit.com/policies/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Reddit
            </a>
            ,{" "}
            <a
              href="https://calendly.com/legal/privacy-notice"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Calendly
            </a>{" "}
            for scheduling, and{" "}
            <a
              href="https://vercel.com/legal/privacy-notice"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Vercel
            </a>{" "}
            for website hosting. Their own privacy notices provide details about their processing.
            Skilldwork does not sell your personal data.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Advertising measurement</h2>
          <p className="leading-7">
            The Reddit Pixel and the Meta Pixel are disabled until you select “Allow.” If
            enabled, they record a page visit, the opening of the scheduler, and, after Calendly
            confirms that an appointment was scheduled, a booking event. Declining does not limit
            the website or booking function. Your choice covers both pixels and is stored in your
            browser so we can respect it on later visits.
          </p>
          <p className="leading-7">
            Independently of that choice, campaign parameters contained in the link you clicked
            (for example utm_source or a Reddit or Meta click identifier) are kept in your browser
            for the
            duration of your visit and attached to a booking, so we can tell which campaign a
            booking came from. They are deleted when you close the tab.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Retention</h2>
          <p className="leading-7">
            We retain personal data only for as long as necessary to handle your inquiry, booking,
            or resulting business relationship. We delete it when the purpose no longer applies or
            you withdraw consent, unless a legal retention obligation requires otherwise.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Your rights</h2>
          <p className="leading-7">
            Subject to the legal requirements, you have the right to access, correct, erase,
            restrict the processing of, and receive a copy of your data. You may also withdraw
            your consent and lodge a complaint with a competent data protection authority. To
            exercise your rights, email the address above.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Voluntary submission</h2>
          <p className="leading-7">
            Providing personal data is voluntary. Without the details needed to respond or arrange
            a meeting, we may be unable to handle your request. Skilldwork does not use automated
            decision-making or profiling for these purposes.
          </p>
        </section>

        <p className="border-t border-[var(--card-border)] pt-7 text-sm">
          Last updated: August 11, 2026
        </p>
      </article>
    </main>
  );
}
