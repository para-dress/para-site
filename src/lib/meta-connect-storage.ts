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
  };
  page?: {
    id: string;
    name: string;
    accessToken?: string;
    tasks?: string[];
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

function decodeCookieConnection(raw?: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    return JSON.parse(decoded) as StoredMetaConnection;
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

  if (!stored) {
    return hasToken
      ? {
          status: "connected",
          updatedAt: new Date(0).toISOString(),
          hasToken,
          storage: {
            configured: hasSharedMetaStorageConfig(),
            mode: hasSharedMetaStorageConfig() ? "vercel-kv" : "none",
            source,
          },
        }
      : null;
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
      configured: hasSharedMetaStorageConfig(),
      mode: source === "shared" ? "vercel-kv" : "cookie-fallback",
      source,
    },
  };
}
