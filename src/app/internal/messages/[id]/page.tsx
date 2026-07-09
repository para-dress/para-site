import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ConversationComposer } from "@/components/internal/ConversationComposer";
import { findConversation } from "@/lib/internal-dashboard";
import { fetchLiveConversation } from "@/lib/meta-inbox";

export default async function InternalConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const liveConversation = await fetchLiveConversation(cookieStore, id);
  const isLiveConversation =
    liveConversation?.source === "live" && !!liveConversation.conversation;
  const conversation =
    isLiveConversation ? liveConversation.conversation : findConversation(id);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/78 p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
        <Link
          href="/internal/messages"
          className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)] underline-offset-4 hover:underline"
        >
          Back to inbox
        </Link>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-4xl text-[var(--color-ink-strong)]">
              {conversation.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{conversation.handle}</p>
          </div>
          <span className="rounded-full bg-[rgba(157,122,63,0.1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)]">
            {isLiveConversation
              ? "Instagram DM conversation · Live"
              : "Instagram DM conversation · Demo"}
          </span>
        </div>
        {!isLiveConversation ? (
          <div className="mt-4 rounded-[1.5rem] border border-[rgba(157,122,63,0.18)] bg-[rgba(247,240,234,0.72)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Demo conversation for review only
            </p>
            <p className="mt-2">
              This thread is sample content for Meta review and is not a real customer conversation from the live inbox.
            </p>
          </div>
        ) : null}
        {liveConversation?.warning ? (
          <div className="mt-4 rounded-[1.25rem] bg-[rgba(157,122,63,0.08)] p-4 text-sm text-[var(--color-ink-strong)]">
            {liveConversation.warning}
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.04)]">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-3xl rounded-[1.75rem] px-5 py-4 text-sm leading-7 ${
                message.sender === "brand"
                  ? "ml-auto bg-[rgba(157,122,63,0.12)] text-[var(--color-ink-strong)]"
                  : "bg-[rgba(247,240,234,0.76)] text-[var(--color-ink-strong)]"
              }`}
            >
              <p>{message.text}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {message.sender === "brand" ? "Para Dress" : conversation.name} · {message.at}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ConversationComposer
        initialDraft={conversation.aiDraft}
        source={isLiveConversation ? "live" : "demo"}
      />
    </div>
  );
}
