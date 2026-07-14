import crypto from "node:crypto";
import type {
  MetaDebugTokenData,
  MetaInstagramAccount,
  MetaPage,
  MetaTokenResponse,
  MetaUserProfile,
} from "@/lib/meta-connect-types";

export const META_CONNECT_STATE_COOKIE = "para_meta_connect_state";

export const metaPermissions = [
  // Start with the minimum documented Instagram Login permission. Once the
  // connection succeeds, messaging/comment permissions can be added back in
  // a fresh consent pass.
  "instagram_business_basic",
] as const;

export type MetaScopeSet = "full";

export function getMetaPermissions(scopeSet: MetaScopeSet = "full") {
  void scopeSet;
  return metaPermissions;
}

export const META_GRAPH_VERSION = "v23.0";

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

export function buildMetaOAuthUrl(state: string, scopeSet: MetaScopeSet = "full") {
  const env = getMetaEnv();
  const redirectUri = buildMetaRedirectUri();
  const params = new URLSearchParams({
    client_id: env.appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: getMetaPermissions(scopeSet).join(","),
    state,
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

export function buildMetaAppAccessToken() {
  const env = getMetaEnv();
  return `${env.appId}|${env.appSecret}`;
}

function buildMetaGraphUrl(pathname: string, params: URLSearchParams) {
  return `https://graph.facebook.com/${META_GRAPH_VERSION}${pathname}?${params.toString()}`;
}

function buildAppSecretProof(accessToken: string, appSecret: string) {
  return crypto.createHmac("sha256", appSecret).update(accessToken).digest("hex");
}

async function fetchMetaJson<T>(pathname: string, params: URLSearchParams) {
  const response = await fetch(buildMetaGraphUrl(pathname, params), {
    cache: "no-store",
  });
  const data = (await response.json()) as T & {
    error?: { message?: string };
  };

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Meta request failed for ${pathname}`);
  }

  return data;
}

export async function fetchMetaJsonWithResponse<T>(pathname: string, params: URLSearchParams) {
  const response = await fetch(buildMetaGraphUrl(pathname, params), {
    cache: "no-store",
  });
  const data = (await response.json()) as T & {
    error?: {
      message?: string;
      type?: string;
      code?: number;
      error_subcode?: number;
      fbtrace_id?: string;
    };
  };

  return {
    ok: response.ok && !data.error,
    status: response.status,
    data,
  };
}

export async function exchangeMetaCodeForToken(code: string) {
  const env = getMetaEnv();
  const body = new URLSearchParams({
    client_id: env.appId,
    client_secret: env.appSecret,
    grant_type: "authorization_code",
    redirect_uri: buildMetaRedirectUri(),
    code,
  });

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = (await response.json()) as MetaTokenResponse & {
    error_message?: string;
    error_type?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_message || data.error_type || "Instagram token exchange failed");
  }

  return data;
}

export async function fetchMetaUserProfile(accessToken: string) {
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "id,username,name,profile_picture_url",
  });

  const response = await fetch(`https://graph.instagram.com/${META_GRAPH_VERSION}/me?${params}`, {
    cache: "no-store",
  });
  const data = (await response.json()) as MetaUserProfile & {
    error?: { message?: string };
  };

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Instagram profile lookup failed");
  }

  return data;
}

export async function fetchMetaPages(accessToken: string) {
  const env = getMetaEnv();
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "id,name,access_token,tasks",
    appsecret_proof: buildAppSecretProof(accessToken, env.appSecret),
  });

  const data = await fetchMetaJson<{ data?: MetaPage[] }>("/me/accounts", params);
  return data.data ?? [];
}

export function findPreferredMetaPage(pages: MetaPage[], preferredPageName = "Para Dress") {
  return (
    pages.find((page) => page.name.trim().toLowerCase() === preferredPageName.trim().toLowerCase()) ??
    pages[0] ??
    null
  );
}

export async function fetchInstagramAccountForPage(
  page: MetaPage,
  userAccessToken?: string,
) {
  const candidateTokens = Array.from(
    new Set([page.access_token, userAccessToken].filter(Boolean) as string[]),
  );

  if (candidateTokens.length === 0) {
    return null;
  }

  let lastError: unknown = null;

  for (const token of candidateTokens) {
    try {
      const params = new URLSearchParams({
        access_token: token,
        fields:
          "instagram_business_account{id,username,name,profile_picture_url},connected_instagram_account{id,username,name,profile_picture_url}",
      });

      const data = await fetchMetaJson<{
        instagram_business_account?: MetaInstagramAccount;
        connected_instagram_account?: MetaInstagramAccount;
      }>(`/${page.id}`, params);

      const instagramAccount =
        data.instagram_business_account ?? data.connected_instagram_account ?? null;

      if (instagramAccount) {
        return instagramAccount;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

export async function debugMetaToken(inputToken: string) {
  const params = new URLSearchParams({
    input_token: inputToken,
    access_token: buildMetaAppAccessToken(),
  });

  const response = await fetchMetaJson<{ data?: MetaDebugTokenData }>("/debug_token", params);
  return response.data ?? null;
}
