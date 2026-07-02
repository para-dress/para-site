import Link from "next/link";
import { navItems } from "@/components/site/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-white px-6 py-12 sm:px-10 lg:px-16 lg:py-14">
      <div className="mx-auto grid max-w-[var(--site-max-width)] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="space-y-4">
          <div>
            <p className="font-display text-[1.8rem] tracking-[0.28em] text-[var(--color-ink)] sm:text-[2rem]">
              PARA
            </p>
            <p className="-mt-1 text-[0.56rem] uppercase tracking-[0.42em] text-[var(--color-muted)]">
              DRESS
            </p>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
            Handcrafted in Ukraine and offered directly to brides across the UK with a more personal, atelier-led experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">Navigate</p>
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-[var(--color-ink-strong)]/78 transition hover:text-[var(--color-ink-strong)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">Collections</p>
            <div className="space-y-2 text-sm text-[var(--color-ink-strong)]/78">
              <p>Minimal silhouettes</p>
              <p>Romantic detail</p>
              <p>New arrivals</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">Contact</p>
            <div className="space-y-2 text-sm text-[var(--color-ink-strong)]/78">
              <a href="mailto:hello@paradress.co.uk" className="block transition hover:text-[var(--color-ink-strong)]">
                hello@paradress.co.uk
              </a>
              <a href="https://instagram.com/para.dress" target="_blank" rel="noreferrer" className="block transition hover:text-[var(--color-ink-strong)]">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
