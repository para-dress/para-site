import Link from "next/link";

export default async function InternalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const showError = params.error === "1";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f0ea_0%,#efe3dc_100%)] px-6 py-10 text-[var(--color-ink-strong)] md:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] border border-[rgba(157,122,63,0.14)] bg-white/60 p-8 shadow-[0_24px_80px_rgba(39,27,16,0.07)] backdrop-blur-sm md:p-12">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-muted)]">
            Para Dress
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-none text-[var(--color-ink-strong)] md:text-7xl">
            Internal dashboard for Instagram review and messaging.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
            This private dashboard gives Para Dress one internal place to review
            the connected Instagram business account, show profile data, and
            manage customer conversations for Meta App Review.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              "Connected Instagram account overview",
              "Inbox list with live conversation layout",
              "Reply workflow ready for Meta review screencast",
              "Internal-only access shell for Para Dress",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-[rgba(157,122,63,0.12)] bg-[rgba(247,240,234,0.7)] p-4 text-sm leading-7 text-[var(--color-ink-strong)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-[rgba(157,122,63,0.14)] bg-white p-8 shadow-[0_24px_80px_rgba(39,27,16,0.08)] md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Secure sign in
          </p>
          <h2 className="mt-4 font-display text-4xl text-[var(--color-ink-strong)]">
            Para Dress Internal Dashboard
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Use your internal access credentials to open the private review
            dashboard.
          </p>

          <form action="/api/internal/login" method="post" className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-full border border-[rgba(157,122,63,0.18)] bg-[rgba(247,240,234,0.55)] px-5 py-3.5 text-sm text-[var(--color-ink-strong)] outline-none transition focus:border-[rgba(111,77,31,0.42)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-full border border-[rgba(157,122,63,0.18)] bg-[rgba(247,240,234,0.55)] px-5 py-3.5 text-sm text-[var(--color-ink-strong)] outline-none transition focus:border-[rgba(111,77,31,0.42)]"
              />
            </label>

            {showError ? (
              <p className="rounded-2xl bg-[rgba(140,62,45,0.08)] px-4 py-3 text-sm text-[#8c3e2d]">
                The email or password did not match the internal dashboard access.
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--color-ink-strong)] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#5b3e18]"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 border-t border-[rgba(157,122,63,0.12)] pt-6">
            <Link href="/" className="text-sm font-medium text-[var(--color-ink-strong)] underline-offset-4 hover:underline">
              Back to paradress.co.uk
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
