"use client";

import { useEffect } from "react";
import {
  COOKIE_CONSENT_EVENT,
  CookieConsent,
  readCookieConsent,
} from "@/components/site/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function applyDeniedMode(measurementId: string) {
  if (typeof window === "undefined") return;

  window[`ga-disable-${measurementId}` as keyof Window] = true as never;
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

function loadGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") return;
  if (document.querySelector(`script[data-ga-loader="${measurementId}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("config", measurementId, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.gaLoader = measurementId;
  document.head.appendChild(script);
}

function syncAnalytics(consent: CookieConsent | null) {
  if (!GA_ID) return;

  if (consent?.analytics) {
    loadGoogleAnalytics(GA_ID);
    return;
  }

  applyDeniedMode(GA_ID);
}

export function GoogleAnalytics() {
  useEffect(() => {
    syncAnalytics(readCookieConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsent>;
      syncAnalytics(customEvent.detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    };
  }, []);

  return null;
}
