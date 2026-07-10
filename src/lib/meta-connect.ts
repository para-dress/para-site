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
  "instagram_basic",
  "instagram_manage_messages",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_metadata",
  "business_management",
] as const;

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

  return `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
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
  const params = new URLSearchParams({
    client_id: env.appId,
    client_secret: env.appSecret,
    redirect_uri: buildMetaRedirectUri(),
    code,
  });

  return fetchMetaJson<MetaTokenResponse>("/oauth/access_token", params);
}

export async function fetchMetaUserProfile(accessToken: string) {
  const env = getMetaEnv();
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "id,name",
    appsecret_proof: buildAppSecretProof(accessToken, env.appSecret),
  });

  return fetchMetaJson<MetaUserProfile>("/me", params);
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
