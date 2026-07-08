import Image from "next/image";
import Link from "next/link";
import { dashboardAccount } from "@/lib/internal-dashboard";
import { getMetaConnectStatus } from "@/lib/meta-connect";

export default async function InternalInstagramPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; connect?: string }>;
}) {
  const params = await searchParams;
  const connectStatus = getMetaConnectStatus();

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

          <Link
            href="/api/internal/meta/connect"
            className="rounded-full bg-[var(--color-ink-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
          >
            Connect Instagram
          </Link>
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

        {params.connect ? (
          <div className="mt-4 rounded-[1.5rem] bg-[rgba(157,122,63,0.08)] p-4 text-sm text-[var(--color-ink-strong)]">
            OAuth callback status: {params.connect}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[rgba(157,122,63,0.16)] bg-[rgba(247,240,234,0.7)]">
              <Image
                src={dashboardAccount.profileImage}
                alt="Para Dress Instagram profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Connected profile
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--color-ink-strong)]">
                {dashboardAccount.username}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {dashboardAccount.accountType}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[rgba(244,236,231,0.78)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]">
            <p>
              <span className="font-semibold">Business name:</span>{" "}
              {dashboardAccount.businessName}
            </p>
            <p>
              <span className="font-semibold">Connection status:</span>{" "}
              {dashboardAccount.connectionStatus}
            </p>
            <p>
              <span className="font-semibold">Connected at:</span>{" "}
              {dashboardAccount.connectedAt}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(39,27,16,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Basic profile data used by the app
          </p>
          <div className="mt-4 divide-y divide-[rgba(157,122,63,0.12)] rounded-[1.5rem] border border-[rgba(157,122,63,0.12)] bg-[rgba(247,240,234,0.56)]">
            {[
              ["Instagram username", dashboardAccount.username],
              ["Instagram account ID", dashboardAccount.accountId],
              ["Account type", dashboardAccount.accountType],
              ["Business label", dashboardAccount.businessName],
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
