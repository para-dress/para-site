import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  clearSharedMetaConnection,
  hasSharedMetaStorageConfig,
  readSharedMetaConnection,
  writeSharedMetaConnection,
} from "@/lib/meta-shared-storage";

export type StoredMetaConnection = {
  status: "connected" | "error";
  connectedAt?: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
  };
  token?: {
    accessToken: string;
    tokenType?: string;
    expiresIn?: number;
    expiresAt?: string;
  };
  page?: {
    id: string;
    name: string;
    accessToken?: string;
    tasks?: string[];
    tokenExpiresAt?: string;
  };
  instagramAccount?: {
    id: string;
    username?: string;
    name?: string;
    profilePictureUrl?: string;
  };
  pageOptions?: Array<{
    id: string;
    name: string;
  }>;
  lastError?: string;
};

export type MetaConnectionSnapshot = Omit<StoredMetaConnection, "token" | "page"> & {
  hasToken: boolean;
  page?: Omit<NonNullable<StoredMetaConnection["page"]>, "accessToken">;
  storage: {
    configured: boolean;
    mode: "vercel-kv" | "cookie-fallback" | "none";
    source: "shared" | "cookie" | "none";
  };
};

export const META_CONNECTION_COOKIE = "para_meta_connection";
export const META_TOKEN_COOKIE = "para_meta_token";
export const META_PAGE_TOKEN_COOKIE = "para_meta_page_token";

export function normalizeStoredMetaConnection(raw: unknown): StoredMetaConnection | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const user = source.user as Record<string, unknown> | undefined;
  const token = source.token as Record<string, unknown> | undefined;
  const page = source.page as Record<string, unknown> | undefined;
  const instagramAccount = source.instagramAccount as Record<string, unknown> | undefined;

  return {
    status: source.status === "error" ? "error" : "connected",
    connectedAt: typeof source.connectedAt === "string" ? source.connectedAt : undefined,
    updatedAt:
      typeof source.updatedAt === "string" ? source.updatedAt : new Date(0).toISOString(),
    user:
      user || source.userId || source.userName
        ? {
            id:
              typeof user?.id === "string"
                ? user.id
                : typeof source.userId === "string"
                  ? source.userId
                  : "",
            name:
              typeof user?.name === "string"
                ? user.name
                : typeof source.userName === "string"
                  ? source.userName
                  : undefined,
          }
        : undefined,
    token:
      token || source.accessToken
        ? {
            accessToken:
              typeof token?.accessToken === "string"
                ? token.accessToken
                : typeof source.accessToken === "string"
                  ? source.accessToken
                  : "",
            tokenType:
              typeof token?.tokenType === "string"
                ? token.tokenType
                : typeof source.tokenType === "string"
                  ? source.tokenType
                  : undefined,
            expiresIn:
              typeof token?.expiresIn === "number"
                ? token.expiresIn
                : typeof source.expiresIn === "number"
                  ? source.expiresIn
                  : undefined,
            expiresAt:
              typeof token?.expiresAt === "string"
                ? token.expiresAt
                : typeof source.expiresAt === "string"
                  ? source.expiresAt
                  : undefined,
          }
        : undefined,
    page:
      page || source.pageId || source.pageName || source.pageAccessToken || source.pageToken
        ? {
            id:
              typeof page?.id === "string"
                ? page.id
                : typeof source.pageId === "string"
                  ? source.pageId
                  : "",
            name:
              typeof page?.name === "string"
                ? page.name
                : typeof source.pageName === "string"
                  ? source.pageName
                  : "",
            accessToken:
              typeof page?.accessToken === "string"
                ? page.accessToken
                : typeof source.pageAccessToken === "string"
                  ? source.pageAccessToken
                  : typeof source.pageToken === "string"
                    ? source.pageToken
                    : undefined,
            tasks: Array.isArray(page?.tasks)
              ? page.tasks.filter((task): task is string => typeof task === "string")
              : undefined,
            tokenExpiresAt:
              typeof page?.tokenExpiresAt === "string"
                ? page.tokenExpiresAt
                : typeof source.pageTokenExpiresAt === "string"
                  ? source.pageTokenExpiresAt
                  : undefined,
          }
        : undefined,
    instagramAccount:
      instagramAccount || source.instagramAccountId || source.instagramUsername
        ? {
            id:
              typeof instagramAccount?.id === "string"
                ? instagramAccount.id
                : typeof source.instagramAccountId === "string"
                  ? source.instagramAccountId
                  : "",
            username:
              typeof instagramAccount?.username === "string"
                ? instagramAccount.username
                : typeof source.instagramUsername === "string"
                  ? source.instagramUsername
                  : undefined,
            name:
              typeof instagramAccount?.name === "string"
                ? instagramAccount.name
                : typeof source.instagramName === "string"
                  ? source.instagramName
                  : undefined,
            profilePictureUrl:
              typeof instagramAccount?.profilePictureUrl === "string"
                ? instagramAccount.profilePictureUrl
                : typeof source.profilePictureUrl === "string"
                  ? source.profilePictureUrl
                  : undefined,
          }
        : undefined,
    pageOptions: Array.isArray(source.pageOptions)
      ? source.pageOptions.filter(
          (item): item is { id: string; name: string } =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as { id?: unknown }).id === "string" &&
            typeof (item as { name?: unknown }).name === "string",
        )
      : undefined,
    lastError: typeof source.lastError === "string" ? source.lastError : undefined,
  };
}

function decodeCookieConnection(raw?: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    return normalizeStoredMetaConnection(JSON.parse(decoded));
  } catch {
    return null;
  }
}

function readCookieStoredMetaConnection(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): StoredMetaConnection | null {
  return decodeCookieConnection(cookieStore.get(META_CONNECTION_COOKIE)?.value);
}

function serializeSnapshotCookie(connection: StoredMetaConnection) {
  const snapshotPayload: Omit<StoredMetaConnection, "token" | "page"> & {
    page?: Omit<NonNullable<StoredMetaConnection["page"]>, "accessToken">;
  } = {
    status: connection.status,
    connectedAt: connection.connectedAt,
    updatedAt: connection.updatedAt,
    user: connection.user,
    instagramAccount: connection.instagramAccount,
    pageOptions: connection.pageOptions,
    lastError: connection.lastError,
    page: connection.page
      ? {
          id: connection.page.id,
          name: connection.page.name,
          tasks: connection.page.tasks,
        }
      : undefined,
  };

  return Buffer.from(JSON.stringify(snapshotPayload), "utf8").toString("base64url");
}

function setLegacyCookie(
  cookieStore: ResponseCookies,
  name: string,
  value: string,
  maxAge: number,
) {
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

function clearLegacyCookies(cookieStore: ResponseCookies) {
  for (const name of [META_CONNECTION_COOKIE, META_TOKEN_COOKIE, META_PAGE_TOKEN_COOKIE]) {
    cookieStore.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }
}

export async function readStoredMetaConnection(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
) {
  const shared = await readSharedMetaConnection();

  if (shared) {
    return {
      connection: shared,
      source: "shared" as const,
    };
  }

  const cookieConnection = readCookieStoredMetaConnection(cookieStore);

  if (cookieConnection) {
    return {
      connection: cookieConnection,
      source: "cookie" as const,
    };
  }

  return {
    connection: null,
    source: "none" as const,
  };
}

export async function writeStoredMetaConnection(
  cookieStore: ResponseCookies,
  connection: StoredMetaConnection,
) {
  const wroteShared = await writeSharedMetaConnection(connection);

  if (wroteShared) {
    clearLegacyCookies(cookieStore);
    return { mode: "vercel-kv" as const };
  }

  setLegacyCookie(cookieStore, META_CONNECTION_COOKIE, serializeSnapshotCookie(connection), 60 * 60 * 24 * 7);

  if (connection.token?.accessToken) {
    setLegacyCookie(cookieStore, META_TOKEN_COOKIE, connection.token.accessToken, 60 * 60 * 24 * 7);
  }

  if (connection.page?.accessToken) {
    setLegacyCookie(cookieStore, META_PAGE_TOKEN_COOKIE, connection.page.accessToken, 60 * 60 * 24 * 7);
  }

  return { mode: "cookie-fallback" as const };
}

export async function clearStoredMetaConnection(cookieStore: ResponseCookies) {
  await clearSharedMetaConnection();
  clearLegacyCookies(cookieStore);
}

export async function getMetaConnectionSnapshot(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): Promise<MetaConnectionSnapshot | null> {
  const { connection: stored, source } = await readStoredMetaConnection(cookieStore);
  const hasToken = source === "shared"
    ? Boolean(stored?.token?.accessToken)
    : Boolean(cookieStore.get(META_TOKEN_COOKIE)?.value);
  const storageConfigured = hasSharedMetaStorageConfig();

  if (!stored) {
    return {
      status: hasToken ? "connected" : "error",
      updatedAt: new Date(0).toISOString(),
      hasToken,
      storage: {
        configured: storageConfigured,
        mode: storageConfigured ? "vercel-kv" : "none",
        source,
      },
    };
  }

  return {
    ...stored,
    hasToken,
    page: stored.page
      ? {
          id: stored.page.id,
          name: stored.page.name,
          tasks: stored.page.tasks,
        }
      : undefined,
    storage: {
      configured: storageConfigured,
      mode: source === "shared" ? "vercel-kv" : "cookie-fallback",
      source,
    },
  };
}
