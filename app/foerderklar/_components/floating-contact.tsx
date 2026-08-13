"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/foerderklar/i18n";
import { ChatThread } from "./chat-thread";

/** Persistent bottom-right contact bubble for post-checkout pages. */
export function FloatingContact() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[100]"
      style={{ bottom: "1.25rem", right: "1.25rem" }}
    >
      {open && (
        <div className="pointer-events-auto mb-3 flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/25 dark:shadow-black/55">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--card-border)] px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text)]">
                {t.chat.title}
              </p>
              <a
                href={`tel:${t.sales.contactPhone.replace(/\s/g, "")}`}
                className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--workflow-blue)] hover:underline"
                title={t.sales.contactCall}
              >
                <PhoneIcon />
                <span className="truncate">{t.account.withProvider}</span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full px-2 py-1 text-sm font-semibold text-[var(--muted-text)] hover:bg-[var(--field-bg)] hover:text-[var(--text)]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex h-[min(60vh,22rem)] flex-col px-4 pb-4 pt-2">
            <ChatThread />
          </div>
        </div>
      )}

      <div className="pointer-events-auto flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--text)] text-[var(--page-bg)] shadow-lg shadow-black/25 transition hover:opacity-90"
          aria-label={open ? "Close chat" : t.sales.contact}
          aria-expanded={open}
        >
          {open ? (
            <span className="text-xl font-semibold leading-none">✕</span>
          ) : (
            <ChatIcon />
          )}
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
