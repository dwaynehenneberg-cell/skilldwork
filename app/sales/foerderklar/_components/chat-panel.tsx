"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";

export function ChatPanel({
  triggerLabel,
  open: controlledOpen,
  onOpenChange,
  embedded,
}: {
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render chat body without floating modal (for account tab). */
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const { state, sendMessage, ensureWelcomeMessage } = useStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (controlledOpen === undefined) setInternalOpen(v);
  };

  useEffect(() => {
    if (open || embedded) ensureWelcomeMessage(t.chat.welcome);
  }, [open, embedded, ensureWelcomeMessage, t.chat.welcome]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [state.messages, open, embedded]);

  function onSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft, t.chat.autoReply);
    setDraft("");
  }

  const body = (
    <div className={`flex flex-col ${embedded ? "h-[28rem]" : "h-[26rem]"}`}>
      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto px-1 py-2"
      >
        {state.messages.length === 0 ? (
          <p className="text-sm text-[var(--muted-text)]">{t.chat.empty}</p>
        ) : (
          state.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                  m.from === "client"
                    ? "bg-[var(--text)] text-[var(--page-bg)]"
                    : "bg-[var(--field-bg)] text-[var(--text)] ring-1 ring-[var(--card-border)]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>
      <form
        onSubmit={onSend}
        className="mt-2 flex gap-2 border-t border-[var(--card-border)] pt-3"
      >
        <input
          className="fk-field flex-1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.chat.placeholder}
        />
        <button type="submit" className="fk-btn fk-btn-dark shrink-0 px-4">
          {t.chat.send}
        </button>
      </form>
    </div>
  );

  if (embedded) {
    return (
      <div>
        <p className="mb-3 text-sm text-[var(--muted-text)]">
          {t.account.withProvider}
        </p>
        {body}
      </div>
    );
  }

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

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4">
          <div className="fk-card flex w-full max-w-md flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {t.chat.title}
                </p>
                <p className="text-xs text-[var(--muted-text)]">
                  {t.account.withProvider}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-sm font-semibold text-[var(--muted-text)] hover:bg-[var(--field-bg)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>
            <div className="px-4 pb-4 pt-2">{body}</div>
          </div>
        </div>
      )}
    </>
  );
}
