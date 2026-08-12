"use client";

import type { ReactNode } from "react";

/** n8n-style dotted underline — hover/focus shows the tip, no question-mark icon. */
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
    <span className="group/tip relative inline max-w-full">
      <button
        type="button"
        className="cursor-help text-left text-sm leading-5 text-[var(--muted-text)] underline decoration-dotted decoration-[color-mix(in_srgb,var(--muted-text)_55%,transparent)] underline-offset-[5px] transition hover:text-[var(--text)] hover:decoration-[var(--text)] focus-visible:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
        aria-describedby={undefined}
        aria-label={typeof children === "string" ? `${children}. ${tip}` : tip}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-30 w-64 max-w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-left text-xs font-normal not-italic leading-5 text-[var(--muted-text)] no-underline opacity-0 shadow-xl shadow-black/10 transition duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 dark:shadow-black/50 ${position}`}
      >
        {tip}
      </span>
    </span>
  );
}
