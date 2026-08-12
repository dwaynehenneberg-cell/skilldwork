import type { Metadata } from "next";
import Link from "next/link";
import {
  COMPARISON_ROWS,
  PAID_PLANS,
  featureFor,
  type FeatureValue,
} from "@/lib/pricing";
import { revealOnLoad, revealOnView } from "../reveal";
import ScrollReveal from "../scroll-reveal";
import ThemeToggle from "../theme-toggle";
import PricingPlans from "./pricing-plans";

export const metadata: Metadata = {
  title: "Pricing | Skilldwork",
  description:
    "Freelancer, Freelancer Pro, and Agency plans for turning services into digital workflows — plus custom solutions.",
};

function CellValue({ value }: { value: FeatureValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="font-medium text-[var(--text)]">Included</span>
    ) : (
      <span className="text-[var(--muted-text)]">—</span>
    );
  }
  return <span className="font-medium text-[var(--text)]">{value}</span>;
}

function FooterLinks() {
  return (
    <footer className="mx-auto mt-16 flex max-w-6xl justify-center gap-4 px-1 pb-4 text-center">
      <Link
        href="/privacy"
        className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
      >
        Privacy
      </Link>
      <Link
        href="/agb"
        className="text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--text)]"
      >
        AGB
      </Link>
    </footer>
  );
}

export default function PricingPage() {
  return (
    <main className="relative min-h-screen px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between pb-10">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--text)] transition-opacity hover:opacity-65"
        >
          skilldwork
        </Link>
        <ThemeToggle />
      </div>

      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p
          className={`${revealOnLoad} mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]`}
        >
          Pricing
        </p>
        <h1
          className={`${revealOnLoad} font-display text-4xl leading-[1.08] tracking-tight text-[var(--text)] [animation-delay:80ms] sm:text-6xl`}
        >
          Select your plan
        </h1>
        <p
          className={`${revealOnLoad} mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--muted-text)] [animation-delay:140ms]`}
        >
          Workflow automation for services — Sales Pages, unlimited Offers, Client Portal. Plans
          scale by concurrent Service Runs, not per-step billing.
        </p>
      </header>

      <div className="mx-auto max-w-6xl">
        <PricingPlans />
      </div>

      <ScrollReveal className="mx-auto mt-20 max-w-6xl">
        <section className={`${revealOnView} space-y-6`}>
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              Compare
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--text)] sm:text-4xl">
              What’s included
            </h2>
            <p className="text-sm leading-6 text-[var(--muted-text)]">
              Same platform on every plan. Limits scale with Sales Pages and how many Service Runs
              can run at once.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/10 dark:shadow-black/60">
            <table className="min-w-[40rem] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="px-5 py-4 font-medium text-[var(--muted-text)]">Feature</th>
                  {PAID_PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-5 py-4 font-display text-lg tracking-tight text-[var(--text)]"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-[var(--card-border)] last:border-0">
                    <th className="px-5 py-3.5 font-normal text-[var(--muted-text)]">{row.label}</th>
                    {PAID_PLANS.map((plan) => (
                      <td key={plan.id} className="px-5 py-3.5">
                        <CellValue value={featureFor(plan, row.key)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mx-auto mt-20 max-w-3xl">
        <section className={`${revealOnView} space-y-6`}>
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]">
              FAQ
            </p>
            <h2 className="font-display text-3xl tracking-tight text-[var(--text)]">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is a Sales Page?",
                a: "Your result-based landing page where Clients choose an Offer and start purchase. Freelancer includes one active Sales Page; Offers on that page are unlimited on every plan.",
              },
              {
                q: "What is a concurrent Service Run?",
                a: "How many full Client journeys (purchase → onboarding → workflow → optional human-in-the-loop → result) can process at the same time. Extra runs queue until a slot frees up. We limit concurrency instead of monthly run buckets because each run uses dedicated capacity.",
              },
              {
                q: "What is the transaction fee?",
                a: "A percentage of Client payments processed through Skilldwork. Freelancer is 10%; Freelancer Pro and Agency are 2.9%. Custom Solution fees are negotiated.",
              },
              {
                q: "How does support work?",
                a: "Every plan includes direct support from the Skilldwork team.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 open:pb-5"
              >
                <summary className="cursor-pointer list-none font-medium text-[var(--text)] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[var(--muted-text)] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <FooterLinks />
    </main>
  );
}
