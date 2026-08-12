"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/foerderklar/i18n";
import { useStore } from "@/lib/foerderklar/store";

/** Shared message list + composer for floating widget and account tab. */
export function ChatThread({ className }: { className?: string }) {
  const { t } = useI18n();
  const { state, sendMessage, ensureWelcomeMessage } = useStore();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureWelcomeMessage(t.chat.welcome);
  }, [ensureWelcomeMessage, t.chat.welcome]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [state.messages]);

  function onSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft, t.chat.autoReply);
    setDraft("");
  }

  return (
    <div className={`flex min-h-0 flex-col ${className ?? "h-full"}`}>
      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-1 py-2"
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
}
