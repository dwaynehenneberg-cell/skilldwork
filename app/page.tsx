import Image from "next/image";
import ThemeToggle from "./theme-toggle";
import WaitlistForm from "./waitlist-form";

const logoClass =
  "h-28 w-28 rounded-3xl ring-1 ring-[var(--logo-ring)] sm:h-32 sm:w-32";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-6 sm:py-16">
      <header className="self-start sm:absolute sm:left-10 sm:top-8 sm:self-auto">
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

      <div className="absolute right-6 top-6 sm:right-10 sm:top-8">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-xl rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl shadow-black/10 sm:p-10 dark:shadow-black/60">
        <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl">
          Create workflows, automate work, get paid.
        </h1>
        <WaitlistForm />
      </section>
    </main>
  );
}
