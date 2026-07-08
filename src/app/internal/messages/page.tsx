import Link from "next/link";
import { dashboardConversations } from "@/lib/internal-dashboard";

export default function InternalMessagesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/78 p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Instagram direct messages
        </p>
        <h2 className="mt-3 font-display text-4xl text-[var(--color-ink-strong)]">
          Inbox
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)]">
          Review the latest customer conversations, open a thread, and send a reply
          from the internal Para Dress dashboard.
        </p>
      </section>

      <section className="grid gap-4">
        {dashboardConversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/internal/messages/${conversation.id}`}
            className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-5 shadow-[0_20px_60px_rgba(39,27,16,0.04)] transition hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-[var(--color-ink-strong)]">
                    {conversation.name}
                  </h3>
                  <span className="text-sm text-[var(--color-muted)]">
                    {conversation.handle}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                  {conversation.lastMessage}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start">
                {conversation.unread > 0 ? (
                  <span className="rounded-full bg-[rgba(157,122,63,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)]">
                    {conversation.unread} unread
                  </span>
                ) : null}
                <span className="text-sm text-[var(--color-muted)]">
                  {conversation.lastAt}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
