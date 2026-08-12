"use client";

import type { ReactNode } from "react";

/** Hover/focus tip — lean CSS-only, n8n-style clarification without a library. */
export function FeatureTip({
  tip,
  children,
  placement = "top",
}: {
  tip: string;
  children: ReactNode;
  placement?: "top" | "bottom";
}) {
  const position =
    placement === "bottom"
      ? "top-[calc(100%+0.4rem)] left-0"
      : "bottom-[calc(100%+0.4rem)] left-0";

  return (
    <span className="group/tip relative inline-flex max-w-full items-start gap-1.5">
      {children}
      <button
        type="button"
        aria-label={tip}
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] text-[0.65rem] font-semibold leading-none text-[var(--muted-text)] transition hover:border-[var(--text)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
      >
        ?
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-30 w-64 max-w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-left text-xs leading-5 text-[var(--muted-text)] opacity-0 shadow-xl shadow-black/10 transition duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 dark:shadow-black/50 ${position}`}
      >
        {tip}
      </span>
    </span>
  );
}
