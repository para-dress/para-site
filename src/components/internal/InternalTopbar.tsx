import Link from "next/link";

export function InternalTopbar() {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/72 px-6 py-5 shadow-[0_20px_60px_rgba(39,27,16,0.05)] backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Para Dress review shell
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--color-ink-strong)] md:text-4xl">
          Internal Instagram Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-[rgba(157,122,63,0.18)] px-4 py-2 text-sm font-medium text-[var(--color-ink-strong)] transition hover:bg-[rgba(157,122,63,0.08)]"
        >
          View public site
        </Link>
        <form action="/api/internal/logout" method="post">
          <button
            type="submit"
            className="rounded-full bg-[var(--color-ink-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3e18]"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
