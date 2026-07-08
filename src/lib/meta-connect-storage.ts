import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

const metaConnectionPath = path.join(process.cwd(), "data", "meta-connection.json");

export async function readStoredMetaConnection(): Promise<StoredMetaConnection | null> {
  try {
    const raw = await readFile(metaConnectionPath, "utf8");
    return JSON.parse(raw) as StoredMetaConnection;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function writeStoredMetaConnection(connection: StoredMetaConnection) {
  await mkdir(path.dirname(metaConnectionPath), { recursive: true });
  await writeFile(metaConnectionPath, JSON.stringify(connection, null, 2));
}

export async function getMetaConnectionSnapshot(): Promise<MetaConnectionSnapshot | null> {
  const stored = await readStoredMetaConnection();

  if (!stored) {
    return null;
  }

  return {
    ...stored,
    hasToken: Boolean(stored.token?.accessToken),
    page: stored.page
      ? {
          id: stored.page.id,
          name: stored.page.name,
          tasks: stored.page.tasks,
        }
      : undefined,
  };
}
