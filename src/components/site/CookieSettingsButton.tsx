"use client";

import { openCookiePreferences } from "@/components/site/cookie-consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="block text-left text-sm text-[var(--color-ink-strong)]/78 transition hover:text-[var(--color-ink-strong)]"
    >
      Cookie Settings
    </button>
  );
}
