import { Redis } from "@upstash/redis";
import {
  normalizeStoredMetaConnection,
  type StoredMetaConnection,
} from "@/lib/meta-connect-storage";

const META_CONNECTION_KV_KEY = "para:meta:connection";
const META_WEBHOOK_LOG_KV_KEY = "para:meta:webhook:last";
const META_WEBHOOK_INBOX_KV_KEY = "para:meta:webhook:inbox";
const META_STORAGE_TEST_KV_KEY = "para:meta:storage:test";
const META_CONNECTION_KV_TTL_SECONDS = 60 * 60 * 24 * 7;
const META_WEBHOOK_LOG_TTL_SECONDS = 60 * 60 * 24 * 7;

export type StoredMetaWebhookLog = {
  receivedAt: string;
  object?: string;
  entryCount: number;
  sample?: unknown;
};

export type StoredMetaWebhookMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId?: string;
  senderUsername?: string;
  senderName?: string;
  direction: "customer" | "brand";
  text: string;
  timestamp: string;
};

export type StoredMetaWebhookConversation = {
  id: string;
  senderId: string;
  senderUsername?: string;
  senderName?: string;
  lastMessage: string;
  updatedAt: string;
  unread: number;
  messages: StoredMetaWebhookMessage[];
};

function getSharedStorageEnv() {
  return {
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
    token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  };
}

export function getSharedStorageEnvPresence() {
  return [
    {
      variable: "KV_REST_API_URL",
      present: Boolean(process.env.KV_REST_API_URL),
    },
    {
      variable: "KV_REST_API_TOKEN",
      present: Boolean(process.env.KV_REST_API_TOKEN),
    },
    {
      variable: "UPSTASH_REDIS_REST_URL",
      present: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    },
    {
      variable: "UPSTASH_REDIS_REST_TOKEN",
      present: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    },
  ] as const;
}

export function getSharedStorageRuntimeInfo() {
  return {
    library: "@upstash/redis",
    adapter: "Redis REST API",
    environment:
      process.env.VERCEL_ENV === "production"
        ? "Production"
        : process.env.VERCEL_ENV === "preview"
          ? "Preview"
          : process.env.VERCEL_ENV === "development"
            ? "Development"
            : process.env.NODE_ENV === "production"
              ? "Production"
              : process.env.NODE_ENV === "development"
                ? "Development"
                : "Unknown",
  };
}

function getRedisClient() {
  const env = getSharedStorageEnv();

  if (!env.url || !env.token) {
    return null;
  }

  return new Redis({
    url: env.url,
    token: env.token,
  });
}

export function hasSharedMetaStorageConfig() {
  const env = getSharedStorageEnv();
  return Boolean(env.url && env.token);
}

export async function readSharedMetaConnection() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  const stored = await redis.get<StoredMetaConnection | string | null>(META_CONNECTION_KV_KEY);

  if (!stored) {
    return null;
  }

  if (typeof stored === "string") {
    try {
      return normalizeStoredMetaConnection(JSON.parse(stored));
    } catch {
      return null;
    }
  }

  return normalizeStoredMetaConnection(stored);
}

export async function writeSharedMetaConnection(connection: StoredMetaConnection) {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  await redis.set(META_CONNECTION_KV_KEY, connection, {
    ex: META_CONNECTION_KV_TTL_SECONDS,
  });

  return true;
}

export async function clearSharedMetaConnection() {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  await redis.del(META_CONNECTION_KV_KEY);
  return true;
}

export async function readSharedMetaWebhookLog() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  const stored = await redis.get<StoredMetaWebhookLog | string | null>(META_WEBHOOK_LOG_KV_KEY);

  if (!stored) {
    return null;
  }

  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as StoredMetaWebhookLog;
    } catch {
      return null;
    }
  }

  return stored;
}

export async function writeSharedMetaWebhookLog(log: StoredMetaWebhookLog) {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  await redis.set(META_WEBHOOK_LOG_KV_KEY, log, {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
  });

  return true;
}

export async function readSharedMetaWebhookInbox() {
  const redis = getRedisClient();
  if (!redis) return [];

  const stored = await redis.get<StoredMetaWebhookConversation[] | string | null>(META_WEBHOOK_INBOX_KV_KEY);
  if (!stored) return [];

  if (typeof stored === "string") {
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed as StoredMetaWebhookConversation[] : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(stored) ? stored : [];
}

export async function appendSharedMetaWebhookMessage(message: StoredMetaWebhookMessage) {
  const redis = getRedisClient();
  if (!redis) return false;

  const existing = await readSharedMetaWebhookInbox();
  const conversationIndex = existing.findIndex((item) => item.id === message.conversationId);
  const previous = conversationIndex >= 0 ? existing[conversationIndex] : undefined;
  const messages = [...(previous?.messages ?? []), message]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(-50);
  const conversation: StoredMetaWebhookConversation = {
    id: message.conversationId,
    // A conversation belongs to the customer, including for outbound messages
    // whose sender is the brand account.
    senderId:
      previous?.senderId ??
      (message.direction === "customer" ? message.senderId : message.recipientId ?? message.senderId),
    senderUsername: message.senderUsername ?? previous?.senderUsername,
    senderName: message.senderName ?? previous?.senderName,
    lastMessage: message.text,
    updatedAt: message.timestamp,
    unread: (previous?.unread ?? 0) + (message.direction === "customer" ? 1 : 0),
    messages,
  };
  const next = [conversation, ...existing.filter((item) => item.id !== message.conversationId)].slice(0, 50);

  await redis.set(META_WEBHOOK_INBOX_KV_KEY, next, { ex: META_WEBHOOK_LOG_TTL_SECONDS });
  return true;
}

export async function runSharedStorageHealthcheck() {
  const redis = getRedisClient();

  if (!redis) {
    return {
      configured: false,
      write: false,
      read: false,
      delete: false,
    };
  }

  const key = `para:meta:healthcheck:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  const payload = {
    ok: true,
    ts: new Date().toISOString(),
  };

  try {
    await redis.set(key, payload, { ex: 60 });
    const stored = await redis.get<typeof payload | string | null>(key);
    const readOk = Boolean(
      stored &&
        (typeof stored === "string"
          ? stored.includes(payload.ts)
          : stored.ts === payload.ts),
    );
    await redis.del(key);
    const afterDelete = await redis.get(key);

    return {
      configured: true,
      write: true,
      read: readOk,
      delete: afterDelete === null,
    };
  } catch {
    try {
      await redis.del(key);
    } catch {}

    return {
      configured: true,
      write: false,
      read: false,
      delete: false,
    };
  }
}

export async function readSharedStorageTestRecord() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  return (await redis.get<{ nonce: string; createdAt: string } | null>(META_STORAGE_TEST_KV_KEY)) ?? null;
}

export async function writeSharedStorageTestRecord() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  const record = {
    nonce: Math.random().toString(16).slice(2),
    createdAt: new Date().toISOString(),
  };

  await redis.set(META_STORAGE_TEST_KV_KEY, record, {
    ex: 60 * 60,
  });

  return record;
}

export async function clearSharedStorageTestRecord() {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  await redis.del(META_STORAGE_TEST_KV_KEY);
  return true;
}
