"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Dotted underline: hover on mouse, tap to pin the tip (n8n-style). */
export function FeatureTip({
  tip,
  children,
  placement = "top",
}: {
  tip: string;
  children: ReactNode;
  placement?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const tipId = useId();

  function placeFrom(anchor: HTMLElement) {
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(256, window.innerWidth - 16);
    let left = rect.left;
    if (left + width > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - width - 8);
    }
    setCoords({
      top: placement === "bottom" ? rect.bottom + 6 : rect.top - 6,
      left,
    });
  }

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const dismiss = () => setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-block max-w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={tipId}
        onPointerDown={(event) => {
          pointerTypeRef.current = event.pointerType;
        }}
        onClick={(event) => {
          if (pointerTypeRef.current === "mouse" && event.detail !== 0) return;
          if (open) {
            setOpen(false);
            return;
          }
          if (rootRef.current) placeFrom(rootRef.current);
          setOpen(true);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          if (window.matchMedia("(pointer: coarse)").matches) return;
          if (rootRef.current) placeFrom(rootRef.current);
          setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          if (window.matchMedia("(pointer: coarse)").matches) return;
          setOpen(false);
        }}
        className="cursor-help text-left text-sm leading-5 text-[var(--muted-text)] underline decoration-dotted decoration-[color-mix(in_srgb,var(--muted-text)_55%,transparent)] underline-offset-[5px] transition hover:text-[var(--text)] hover:decoration-[var(--text)] focus-visible:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
      >
        {children}
      </button>
      <span id={tipId} className="sr-only">
        {tip}
      </span>
      {open && coords
        ? createPortal(
            <span
              role="tooltip"
              aria-hidden
              style={{
                top: coords.top,
                left: coords.left,
                transform: placement === "top" ? "translateY(-100%)" : undefined,
              }}
              className="pointer-events-none fixed z-50 w-64 max-w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-left text-xs font-normal leading-5 text-[var(--muted-text)] shadow-xl shadow-black/10 dark:shadow-black/50"
            >
              {tip}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
