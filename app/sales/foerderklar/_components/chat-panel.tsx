"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/foerderklar/i18n";
import { ChatThread } from "./chat-thread";

/** Sales-sidebar contact entry: opens the same bottom-right chat widget. */
export function ChatPanel({
  triggerLabel,
  open: controlledOpen,
  onOpenChange,
  embedded,
}: {
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (controlledOpen === undefined) setInternalOpen(v);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (embedded) {
    return (
      <div>
        <p className="mb-3 text-sm text-[var(--muted-text)]">
          {t.account.withProvider}
        </p>
        <ChatThread className="h-[28rem]" />
      </div>
    );
  }

  const widget =
    open && mounted
      ? createPortal(
          <div
            className="pointer-events-auto fixed z-[100] flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl shadow-black/25 dark:shadow-black/55"
            style={{ bottom: "1.25rem", right: "1.25rem" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {t.chat.title}
                </p>
                <a
                  href={`tel:${t.sales.contactPhone.replace(/\s/g, "")}`}
                  className="mt-0.5 inline-flex text-xs font-semibold text-[var(--workflow-blue)] hover:underline"
                >
                  {t.account.withProvider}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-sm font-semibold text-[var(--muted-text)] hover:bg-[var(--field-bg)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>
            <div className="flex h-[min(70vh,26rem)] flex-col px-4 pb-4 pt-2">
              <ChatThread />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {controlledOpen === undefined && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fk-btn fk-btn-ghost w-full text-sm"
        >
          {triggerLabel ?? t.chat.open}
        </button>
      )}
      {widget}
    </>
  );
}
