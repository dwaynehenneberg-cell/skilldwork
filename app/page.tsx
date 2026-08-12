import Image from "next/image";
import Link from "next/link";
import BookingWidget from "./booking-widget";
import Mission from "./mission";
import { revealOnLoad } from "./reveal";
import ThemeToggle from "./theme-toggle";
import WorkflowMap from "./workflow-map";

const logoClass =
  "h-28 w-28 rounded-3xl ring-1 ring-[var(--logo-ring)] sm:h-32 sm:w-32";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <header className="absolute left-4 top-4 z-10 sm:left-10 sm:top-8">
        <Image
          src="/logo-light.png"
          alt="skilld logo"
          width={128}
          height={128}
          className={`${logoClass} dark:hidden`}
          priority
        />
        <Image
          src="/logo.png"
          alt="skilld logo"
          width={128}
          height={128}
          className={`${logoClass} hidden dark:block`}
          priority
        />
      </header>

      <div className="absolute right-6 top-6 z-10 sm:right-10 sm:top-8">
        <ThemeToggle />
      </div>

      <section
        id="book"
        className="flex min-h-screen w-full items-center justify-center px-4 pb-16 pt-44 sm:px-6 sm:py-36"
      >
        <div className="w-full max-w-xl rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
          <p
            className={`${revealOnLoad} mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-text)]`}
          >
            For freelancers, agencies, and expert service businesses
          </p>
          <h1
            className={`${revealOnLoad} font-display text-4xl leading-[1.08] tracking-tight text-[var(--text)] [animation-delay:100ms] sm:text-5xl`}
          >
            Turn your service into an automatable workflow.
          </h1>
          <div className={`${revealOnLoad} [animation-delay:200ms]`}>
            <BookingWidget />
          </div>
        </div>
      </section>

      <WorkflowMap />

      <Mission />

      <footer className="px-4 pb-8 text-center sm:px-6">
        <div className="flex justify-center gap-4">
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
        </div>
      </footer>
    </main>
  );
}
