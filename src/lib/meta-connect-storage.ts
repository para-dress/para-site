import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
};

export const META_CONNECTION_COOKIE = "para_meta_connection";
export const META_TOKEN_COOKIE = "para_meta_token";
export const META_PAGE_TOKEN_COOKIE = "para_meta_page_token";

export function readStoredMetaConnection(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): StoredMetaConnection | null {
  try {
    const raw = cookieStore.get(META_CONNECTION_COOKIE)?.value;

    if (!raw) {
      return null;
    }

    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    return JSON.parse(decoded) as StoredMetaConnection;
  } catch {
    return null;
  }
}

export function writeStoredMetaConnection(
  cookieStore: ResponseCookies,
  connection: StoredMetaConnection,
) {
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

  cookieStore.set({
    name: META_CONNECTION_COOKIE,
    value: Buffer.from(JSON.stringify(snapshotPayload), "utf8").toString("base64url"),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (connection.token?.accessToken) {
    cookieStore.set({
      name: META_TOKEN_COOKIE,
      value: connection.token.accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (connection.page?.accessToken) {
    cookieStore.set({
      name: META_PAGE_TOKEN_COOKIE,
      value: connection.page.accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export function clearStoredMetaConnection(cookieStore: ResponseCookies) {
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

export function getMetaConnectionSnapshot(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): MetaConnectionSnapshot | null {
  const stored = readStoredMetaConnection(cookieStore);
  const hasToken = Boolean(cookieStore.get(META_TOKEN_COOKIE)?.value);

  if (!stored) {
    return hasToken
      ? {
          status: "connected",
          updatedAt: new Date(0).toISOString(),
          hasToken,
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
  };
}
