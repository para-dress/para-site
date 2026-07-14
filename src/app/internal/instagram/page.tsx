import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { dashboardAccount } from "@/lib/internal-dashboard";
import { getMetaConnectStatus } from "@/lib/meta-connect";
import { getMetaConnectionSnapshot } from "@/lib/meta-connect-storage";

export default async function InternalInstagramPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; connect?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const connectStatus = getMetaConnectStatus();
  const cookieStore = await cookies();
  const connection = await getMetaConnectionSnapshot(cookieStore);
  const connectedProfile = connection?.instagramAccount;
  const isLiveProfileData = Boolean(connectedProfile?.id);
  const profileUsername = connectedProfile?.username
    ? `@${connectedProfile.username.replace(/^@/, "")}`
    : dashboardAccount.username;
  const profileName = connectedProfile?.name || dashboardAccount.businessName;
  const connectionLabel =
    connection?.status === "connected"
      ? connection.storage.mode === "vercel-kv"
        ? "Connected and shared token stored"
        : "Connected in this browser session only"
      : connection?.hasToken
        ? "Connected"
        : "Not connected yet";
  const connectedAt = connection?.connectedAt
    ? `${new Date(connection.connectedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })} UTC`
    : dashboardAccount.connectedAt;
  const connectMessage =
    params.connect === "connected"
      ? "Instagram authorization completed and the Meta token was stored on the server."
      : params.connect === "exchange-failed"
        ? `Instagram authorization returned, but the server-side token exchange failed${connection?.lastError ? `: ${connection.lastError}` : "."}`
        : params.connect === "error"
          ? "Meta returned an OAuth error before the token exchange finished."
          : params.connect === "invalid-state"
            ? "The callback reached the dashboard without a valid login state cookie."
            : null;
  const resetMessage =
    params.reset === "cleared"
      ? "Stored Meta connection was cleared. You can reconnect Instagram now to mint a fresh token with the latest permissions."
      : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/78 p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Instagram professional account
            </p>
            <h2 className="mt-3 font-display text-4xl text-[var(--color-ink-strong)]">
              Connected account overview
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)]">
              This is the internal Para Dress account view used to confirm which
              Instagram business profile is connected before opening messaging and
              business workflows.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/api/internal/meta/connect"
              className="rounded-full bg-[var(--color-ink-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
            >
              {connection?.status === "connected" ? "Reconnect Instagram" : "Connect Instagram"}
            </Link>


            <form action="/api/internal/meta/disconnect" method="post">
              <button
                type="submit"
                className="rounded-full border border-[rgba(157,122,63,0.18)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)]"
              >
                Clear stored connection
              </button>
            </form>

            <Link
              href="/api/internal/meta/diagnostic"
              className="rounded-full border border-[rgba(157,122,63,0.18)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)]"
            >
              Open diagnostic JSON
            </Link>
          </div>
        </div>

        {!connectStatus.ready ? (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(157,122,63,0.14)] bg-[rgba(247,240,234,0.7)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p className="font-semibold">Meta connect setup is not finished yet.</p>
            <p className="mt-2">
              Missing environment values: {connectStatus.missing.join(", ")}
            </p>
          </div>
        ) : null}

        {params.setup ? (
          <div className="mt-6 rounded-[1.5rem] bg-[rgba(140,62,45,0.08)] p-4 text-sm text-[#8c3e2d]">
            Meta connect could not start because setup is incomplete: {params.setup}
          </div>
        ) : null}

        {connectMessage ? (
          <div className="mt-4 rounded-[1.5rem] bg-[rgba(157,122,63,0.08)] p-4 text-sm text-[var(--color-ink-strong)]">
            {connectMessage}
          </div>
        ) : null}

        {resetMessage ? (
          <div className="mt-4 rounded-[1.5rem] bg-[rgba(157,122,63,0.08)] p-4 text-sm text-[var(--color-ink-strong)]">
            {resetMessage}
          </div>
        ) : null}

        {connection?.storage.mode === "vercel-kv" ? (
          <div className="mt-4 rounded-[1.5rem] border border-[rgba(79,119,78,0.18)] bg-[rgba(79,119,78,0.08)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p className="font-semibold">Shared Meta storage is active.</p>
            <p className="mt-2">
              The connection is stored server-side and can be reused across browser sessions.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-[rgba(140,62,45,0.18)] bg-[rgba(140,62,45,0.06)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p className="font-semibold">Shared Meta storage is not active yet.</p>
            <p className="mt-2">
              Right now the connection only survives in the current browser session. Add Vercel KV environment variables and reconnect Instagram so reviewers can see the same stored token state.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[rgba(157,122,63,0.14)] bg-[rgba(247,240,234,0.56)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
          <p className="font-semibold">Instagram Business Login</p>
          <p className="mt-2">
            Connect Instagram uses the Instagram Business Login flow configured in your Meta app. It requests only the Instagram business permissions needed for profile access, comments, and messages.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Meta review guide
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--color-ink-strong)]">
            Suggested reviewer walkthrough
          </h3>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            {[
              "Open Instagram account overview and confirm the connected business profile.",
              "Open Messages to review the inbox list and conversation detail screen.",
              "Use the in-dashboard reply composer to demonstrate the response workflow.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(157,122,63,0.12)] text-xs font-semibold">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Server-side connect status
          </p>
          <div className="mt-4 space-y-3 rounded-[1.5rem] bg-[rgba(247,240,234,0.56)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p><span className="font-semibold">Token stored:</span> {connection?.hasToken ? "Yes" : "No"}</p>
            <p><span className="font-semibold">Selected Facebook Page:</span> {connection?.page?.name || "Not captured yet"}</p>
            <p><span className="font-semibold">Connected by:</span> {connection?.user?.name || "Not captured yet"}</p>
            <p><span className="font-semibold">Available pages in token:</span> {connection?.pageOptions?.length ?? 0}</p>
            <p><span className="font-semibold">Storage mode:</span> {connection?.storage.mode === "vercel-kv" ? "Vercel KV" : connection?.storage.mode === "cookie-fallback" ? "Cookie fallback" : "Not configured"}</p>
            <p><span className="font-semibold">Instagram account link:</span> {isLiveProfileData ? "Live account ID captured" : "Missing from Meta response"}</p>
          </div>
        </div>
      </section>

      {!isLiveProfileData ? (
        <section className="rounded-[2rem] border border-[rgba(140,62,45,0.18)] bg-[rgba(140,62,45,0.06)] p-6 text-sm leading-7 text-[var(--color-ink-strong)] shadow-[0_20px_60px_rgba(39,27,16,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Meta inbox blocker
          </p>
          <p className="mt-3">
            The shared token is stored, but Meta did not return a usable Instagram account ID for the selected Facebook Page. Until that link is returned, the Messages screen has to stay on demo fallback.
          </p>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[rgba(157,122,63,0.16)] bg-[rgba(247,240,234,0.7)]">
              <Image src={dashboardAccount.profileImage} alt="Para Dress Instagram profile" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Connected profile</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--color-ink-strong)]">{profileUsername}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{dashboardAccount.accountType}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[rgba(244,236,231,0.78)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p><span className="font-semibold">Business name:</span> {profileName}</p>
            <p><span className="font-semibold">Connection status:</span> {connectionLabel}</p>
            <p><span className="font-semibold">Connected at:</span> {connectedAt}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Basic profile data used by the app</p>
          <div className="mt-4 divide-y divide-[rgba(157,122,63,0.12)] rounded-[1.5rem] border border-[rgba(157,122,63,0.12)] bg-[rgba(247,240,234,0.56)]">
            {[
              ["Instagram username", profileUsername],
              ["Instagram account ID", connectedProfile?.id || "Not returned by Meta yet"],
              ["Account type", dashboardAccount.accountType],
              ["Business label", profileName],
              ["Selected Facebook Page", connection?.page?.name || "Not captured yet"],
              ["Profile data source", isLiveProfileData ? "Meta live data" : "Dashboard fallback only"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
                <p className="text-sm font-semibold text-[var(--color-ink-strong)]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
