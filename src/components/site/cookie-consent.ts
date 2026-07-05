export type CookieConsent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "para_dress_cookie_consent";
export const COOKIE_CONSENT_EVENT = "para-dress-cookie-consent";
export const COOKIE_PREFERENCES_OPEN_EVENT = "para-dress-cookie-preferences-open";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean") return null;

    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }),
  );
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT));
}
