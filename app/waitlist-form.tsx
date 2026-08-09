"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

const fieldClass =
  "w-full rounded-full border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/30";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/70">
        You&rsquo;re on the list — we&rsquo;ll be in touch to book your call.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          aria-label="Name"
          autoComplete="name"
          className={fieldClass}
          maxLength={120}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          value={name}
        />
        <input
          aria-label="Company"
          autoComplete="organization"
          className={fieldClass}
          maxLength={120}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          required
          value={company}
        />
      </div>
      <button
        className="w-full rounded-full bg-white px-5 py-3.5 font-display text-sm uppercase tracking-wider text-black transition hover:bg-white/85 disabled:opacity-50"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Booking…" : "Book a call"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
