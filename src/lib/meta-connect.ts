import crypto from "node:crypto";

export const META_CONNECT_STATE_COOKIE = "para_meta_connect_state";

export const metaPermissions = [
  "instagram_basic",
  "instagram_manage_messages",
  "pages_show_list",
  "pages_manage_metadata",
  "business_management",
] as const;

export function getMetaEnv() {
  return {
    appId: process.env.META_APP_ID ?? "",
    appSecret: process.env.META_APP_SECRET ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  };
}

export function getMetaConnectStatus() {
  const env = getMetaEnv();

  return {
    ready: Boolean(env.appId && env.appSecret && env.siteUrl),
    missing: [
      !env.appId ? "META_APP_ID" : null,
      !env.appSecret ? "META_APP_SECRET" : null,
      !env.siteUrl ? "NEXT_PUBLIC_SITE_URL" : null,
    ].filter(Boolean) as string[],
  };
}

export function buildMetaRedirectUri() {
  const env = getMetaEnv();
  return `${env.siteUrl.replace(/\/$/, "")}/api/internal/meta/callback`;
}

export function createMetaState() {
  return crypto.randomBytes(24).toString("hex");
}

export function buildMetaOAuthUrl(state: string) {
  const env = getMetaEnv();
  const redirectUri = buildMetaRedirectUri();
  const params = new URLSearchParams({
    client_id: env.appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: metaPermissions.join(","),
    state,
  });

  return `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`;
}
