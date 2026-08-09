import Image from "next/image";
import WaitlistForm from "./waitlist-form";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <header className="absolute left-6 top-6 sm:left-10 sm:top-8">
        <Image
          src="/logo.png"
          alt="skilld logo"
          width={64}
          height={64}
          className="h-14 w-14 rounded-2xl ring-1 ring-white/10 sm:h-16 sm:w-16"
          priority
        />
      </header>

      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#1A1A19] p-6 shadow-2xl shadow-black/60 sm:p-10">
        <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl">
          Create workflows, automate work, get paid.
        </h1>
        <WaitlistForm />
      </section>
    </main>
  );
}
