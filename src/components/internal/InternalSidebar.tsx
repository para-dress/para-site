import Link from "next/link";

const navItems = [
  { href: "/internal", label: "Overview" },
  { href: "/internal/instagram", label: "Instagram Account" },
  { href: "/internal/messages", label: "Messages" },
];

export function InternalSidebar() {
  return (
    <aside className="w-full max-w-xs rounded-[2rem] border border-[rgba(157,122,63,0.14)] bg-white/70 p-5 shadow-[0_20px_60px_rgba(39,27,16,0.06)] backdrop-blur-sm">
      <div className="mb-8 border-b border-[rgba(157,122,63,0.12)] pb-5">
        <p className="font-display text-2xl tracking-[0.18em] text-[var(--color-ink)]">
          PARA
        </p>
        <p className="-mt-1 text-xs uppercase tracking-[0.38em] text-[var(--color-muted)]">
          Internal Dashboard
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink-strong)] transition hover:bg-[rgba(157,122,63,0.08)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl bg-[rgba(244,236,231,0.8)] p-4 text-sm text-[var(--color-ink-strong)]">
        <p className="font-semibold uppercase tracking-[0.16em] text-[0.7rem] text-[var(--color-muted)]">
          Review scope
        </p>
        <ul className="mt-3 space-y-2 text-[0.95rem] leading-6">
          <li>Instagram account connection</li>
          <li>Profile visibility for account review</li>
          <li>Inbox and conversation workflow</li>
        </ul>
      </div>
    </aside>
  );
}
