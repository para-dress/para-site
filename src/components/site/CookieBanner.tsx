"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_PREFERENCES_OPEN_EVENT,
  CookieConsent,
  readCookieConsent,
  saveCookieConsent,
} from "@/components/site/cookie-consent";

const makeConsent = (analytics: boolean): CookieConsent => ({
  essential: true,
  analytics,
  updatedAt: new Date().toISOString(),
});

export function CookieBanner() {
  const [savedConsent, setSavedConsent] = useState<CookieConsent | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => {
      const existing = readCookieConsent();
      setSavedConsent(existing);
      setAnalyticsEnabled(existing?.analytics ?? false);
      setReady(true);
    };

    const timeout = window.setTimeout(start, 0);

    const handleConsentChange = () => {
      const current = readCookieConsent();
      setSavedConsent(current);
      setAnalyticsEnabled(current?.analytics ?? false);
      setManageOpen(false);
    };

    const handleOpenPreferences = () => {
      const current = readCookieConsent();
      setSavedConsent(current);
      setAnalyticsEnabled(current?.analytics ?? false);
      setManageOpen(true);
      setReady(true);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handleOpenPreferences);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handleOpenPreferences);
    };
  }, []);

  if (!ready) return null;

  const shouldShow = !savedConsent || manageOpen;
  if (!shouldShow) return null;

  const acceptAll = () => {
    const consent = makeConsent(true);
    setSavedConsent(consent);
    setAnalyticsEnabled(true);
    setManageOpen(false);
    saveCookieConsent(consent);
  };

  const acceptEssential = () => {
    const consent = makeConsent(false);
    setSavedConsent(consent);
    setAnalyticsEnabled(false);
    setManageOpen(false);
    saveCookieConsent(consent);
  };

  const savePreferences = () => {
    const consent = makeConsent(analyticsEnabled);
    setSavedConsent(consent);
    setManageOpen(false);
    saveCookieConsent(consent);
  };

  const openManage = () => {
    setAnalyticsEnabled(savedConsent?.analytics ?? false);
    setManageOpen(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-5xl rounded-[1.8rem] border border-[rgba(111,77,31,0.14)] bg-white/96 p-5 text-[var(--color-ink-strong)] shadow-[0_20px_60px_rgba(38,25,15,0.16)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Cookie settings
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-[2.2rem]">
              We use cookies to keep the site working and, with your permission, understand visits through analytics.
            </h2>
            <p className="text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Essential cookies are always on. Analytics cookies help us understand traffic and improve the experience. You can accept all, keep essential only, or manage preferences now.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:max-w-[24rem] lg:justify-end">
            {!manageOpen ? (
              <button
                type="button"
                onClick={openManage}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(111,77,31,0.16)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)] transition hover:bg-[var(--color-cream)]"
              >
                Manage cookies
              </button>
            ) : (
              <button
                type="button"
                onClick={savePreferences}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(111,77,31,0.16)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)] transition hover:bg-[var(--color-cream)]"
              >
                Save preferences
              </button>
            )}
            <button
              type="button"
              onClick={acceptEssential}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(111,77,31,0.16)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)] transition hover:bg-[var(--color-cream)]"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-ink-strong)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_26px_rgba(39,27,16,0.12)] transition hover:bg-[#5f4118]"
            >
              Accept all
            </button>
          </div>
        </div>

        {manageOpen ? (
          <div className="mt-5 grid gap-4 border-t border-[var(--color-line)] pt-5 sm:grid-cols-2">
            <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-[var(--color-cream)]/55 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-strong)]">
                    Essential
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    Required for basic site functions and security.
                  </p>
                </div>
                <span className="rounded-full bg-[rgba(111,77,31,0.12)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-strong)]">
                  Always on
                </span>
              </div>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-[1.3rem] border border-[var(--color-line)] bg-[var(--color-cream)]/55 p-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-strong)]">
                  Analytics
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Helps us understand visits and improve the website using tools such as Google Analytics.
                </p>
              </div>
              <span
                className={`relative mt-1 inline-flex h-7 w-12 shrink-0 rounded-full transition ${
                  analyticsEnabled ? "bg-[var(--color-ink-strong)]" : "bg-[rgba(111,77,31,0.18)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    analyticsEnabled ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
