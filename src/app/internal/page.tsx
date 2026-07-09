import Link from "next/link";
import { cookies } from "next/headers";
import { dashboardAccount, dashboardConversations } from "@/lib/internal-dashboard";
import { getMetaConnectionSnapshot } from "@/lib/meta-connect-storage";

export default async function InternalDashboardPage() {
  const cookieStore = await cookies();
  const connection = await getMetaConnectionSnapshot(cookieStore);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/76 p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Current review goal</p>
          <h2 className="mt-3 font-display text-4xl text-[var(--color-ink-strong)]">
            Show Meta a real internal tool for Instagram profile and message handling.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            This dashboard is the internal Para Dress surface for connecting the Instagram professional account,
            viewing business profile information, opening direct messages, and replying from one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Connected account",
                value: connection?.instagramAccount?.username ? `@${connection.instagramAccount.username}` : dashboardAccount.username,
              },
              { label: "Conversations", value: String(dashboardConversations.length) },
              {
                label: "Connection",
                value:
                  connection?.status === "connected"
                    ? connection.storage.mode === "vercel-kv"
                      ? "Shared token stored"
                      : "Session token only"
                    : dashboardAccount.connectionStatus,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-[rgba(157,122,63,0.12)] bg-[rgba(247,240,234,0.72)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--color-ink-strong)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/76 p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Meta review flow</p>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <li>1. Sign in to the internal dashboard.</li>
            <li>2. Open Instagram Account and confirm the connected profile details.</li>
            <li>3. Verify that the Meta token was stored server-side.</li>
            <li>4. Open Inbox and review a conversation thread.</li>
            <li>5. Draft or send a reply from the dashboard composer.</li>
          </ol>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Link href="/internal/instagram" className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.04)] transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Instagram account</p>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--color-ink-strong)]">View connected profile data</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Show the connected Instagram username, business status, profile image, account ID, selected Facebook Page, and connection state.
          </p>
        </Link>

        <Link href="/internal/messages" className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.04)] transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Messages</p>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--color-ink-strong)]">Open inbox and conversation view</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Review incoming messages, open conversation details, and show the reply workflow.
          </p>
        </Link>
      </section>
    </div>
  );
}
