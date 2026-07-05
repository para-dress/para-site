export type CookieConsent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "para_dress_cookie_consent";
export const COOKIE_CONSENT_EVENT = "para-dress-cookie-consent";
export const COOKIE_PREFERENCES_OPEN_EVENT = "para-dress-cookie-preferences-open";

let memoryConsent: CookieConsent | null = null;

function normalizeConsent(parsed: Partial<CookieConsent>): CookieConsent | null {
  if (typeof parsed.analytics !== "boolean") return null;

  return {
    essential: true,
    analytics: parsed.analytics,
    updatedAt:
      typeof parsed.updatedAt === "string"
        ? parsed.updatedAt
        : new Date().toISOString(),
  };
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return memoryConsent;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return memoryConsent;

    const parsed = normalizeConsent(JSON.parse(raw) as Partial<CookieConsent>);
    if (!parsed) return memoryConsent;

    memoryConsent = parsed;
    return parsed;
  } catch {
    return memoryConsent;
  }
}

export function saveCookieConsent(consent: CookieConsent) {
  memoryConsent = consent;

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Some in-app or privacy-restricted browsers may block localStorage writes.
    // Keep consent in memory for the current session instead of crashing.
  }

  window.dispatchEvent(
    new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }),
  );
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT));
}
