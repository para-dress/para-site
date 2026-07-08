"use client";

import { useState } from "react";

type ConversationComposerProps = {
  initialDraft: string;
};

export function ConversationComposer({
  initialDraft,
}: ConversationComposerProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<"idle" | "drafted" | "sent">("idle");

  return (
    <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-5 shadow-[0_20px_60px_rgba(39,27,16,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Reply tools
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink-strong)]">
            Draft and send a reply
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(initialDraft);
            setStatus("drafted");
          }}
          className="rounded-full border border-[rgba(157,122,63,0.18)] px-4 py-2 text-sm font-medium text-[var(--color-ink-strong)] transition hover:bg-[rgba(157,122,63,0.08)]"
        >
          Generate AI draft
        </button>
      </div>

      <textarea
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setStatus("idle");
        }}
        className="mt-4 min-h-40 w-full rounded-[1.5rem] border border-[rgba(157,122,63,0.18)] bg-[rgba(247,240,234,0.55)] px-4 py-4 text-sm leading-7 text-[var(--color-ink-strong)] outline-none transition focus:border-[rgba(111,77,31,0.45)]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          {status === "idle" && "Edit the response, then send it back to Instagram."}
          {status === "drafted" && "AI draft loaded. Review and send when ready."}
          {status === "sent" && "Reply marked as sent in the dashboard flow."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("sent")}
          className="rounded-full bg-[var(--color-ink-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3e18]"
        >
          Send reply
        </button>
      </div>
    </div>
  );
}
