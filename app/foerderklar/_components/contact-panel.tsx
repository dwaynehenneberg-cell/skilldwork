"use client";

import { useState } from "react";
import { useI18n } from "@/lib/foerderklar/i18n";
import { ChatPanel } from "./chat-panel";

/** Lean contact entry on sales sidebar only: message (chat) or call. */
export function ContactPanel() {
  const { t } = useI18n();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="fk-btn fk-btn-ghost text-sm"
        >
          {t.sales.contactMessage}
        </button>
        <a
          href={`tel:${t.sales.contactPhone.replace(/\s/g, "")}`}
          className="fk-btn fk-btn-ghost text-sm"
        >
          {t.sales.contactCall}
        </a>
      </div>
      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
