"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navItems } from "@/components/site/site-data";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const transparent = pathname === "/" && !isScrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const headerClass = useMemo(() => {
    if (transparent) {
      return "border-transparent bg-transparent text-white";
    }

    return "border-[rgba(111,77,31,0.08)] bg-[rgba(247,240,234,0.92)] text-[var(--color-ink-strong)] shadow-[0_12px_40px_rgba(29,21,16,0.06)] backdrop-blur-xl";
  }, [transparent]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div
          className={`mx-auto flex max-w-[var(--site-max-width)] items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 sm:px-6 lg:px-8 ${headerClass}`}
        >
          <Link href="/" className="relative block h-12 w-[8.6rem] sm:h-14 sm:w-[10.5rem] lg:h-16 lg:w-[12rem]">
            <Image
              src={transparent ? "/brand/para-dress-wordmark-white.png" : "/brand/para-dress-wordmark-gold.png"}
              alt="Para Dress"
              width={759}
              height={400}
              priority
              className={`absolute left-0 top-1/2 h-auto w-[8.6rem] -translate-y-1/2 transition-all duration-500 sm:w-[10.5rem] lg:w-[12rem] ${
                transparent
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-90 opacity-0"
              }`}
            />
            <Image
              src={transparent ? "/brand/para-dress-monogram-white.png" : "/brand/para-dress-monogram-gold.png"}
              alt="Para Dress monogram"
              width={345}
              height={341}
              priority
              className={`absolute left-0 top-1/2 h-auto w-10 -translate-y-1/2 transition-all duration-500 sm:w-11 lg:w-12 ${
                transparent
                  ? "pointer-events-none scale-75 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.74rem] uppercase tracking-[0.18em] transition ${
                    active ? "opacity-100" : "opacity-68 hover:opacity-100"
                  }`}
                >
                  <span className="relative inline-block">
                    {item.label}
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-current transition-all ${
                        active ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 xl:block">
            <Link
              href="/contact"
              className={`inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-[0.76rem] font-semibold uppercase leading-none tracking-[0.12em] transition ${
                transparent
                  ? "border border-white/30 bg-white/10 text-white hover:bg-white/16"
                  : "bg-[var(--color-ink-strong)] text-white hover:bg-[#5f4118]"
              }`}
            >
              <span className="block text-white">Book Consultation</span>
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15 xl:hidden"
          >
            <span className="relative h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-current transition ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] h-px w-4 bg-current transition ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] h-px w-4 bg-current transition ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex xl:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[rgba(20,15,12,0.42)] transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative ml-auto flex h-full w-full flex-col bg-[var(--color-cream)] px-6 pb-10 pt-28 text-[var(--color-ink-strong)] transition-transform duration-500 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav className="flex flex-1 flex-col justify-center gap-6">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-3xl font-display leading-none transition ${
                    active ? "opacity-100" : "opacity-72"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-13 items-center justify-center rounded-full border border-[rgba(111,77,31,0.14)] bg-[rgba(168,127,52,0.12)] px-7 text-center text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#7b581e] shadow-[0_10px_26px_rgba(39,27,16,0.06)] transition hover:bg-[rgba(168,127,52,0.18)]"
          >
            <span className="text-[#7b581e]">Book Consultation</span>
          </Link>
        </div>
      </div>
    </>
  );
}
