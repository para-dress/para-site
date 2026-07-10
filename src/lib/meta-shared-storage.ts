import { Redis } from "@upstash/redis";
import {
  normalizeStoredMetaConnection,
  type StoredMetaConnection,
} from "@/lib/meta-connect-storage";

const META_CONNECTION_KV_KEY = "para:meta:connection";
const META_WEBHOOK_LOG_KV_KEY = "para:meta:webhook:last";
const META_CONNECTION_KV_TTL_SECONDS = 60 * 60 * 24 * 7;
const META_WEBHOOK_LOG_TTL_SECONDS = 60 * 60 * 24 * 7;

export type StoredMetaWebhookLog = {
  receivedAt: string;
  object?: string;
  entryCount: number;
  sample?: unknown;
};

function getSharedStorageEnv() {
  return {
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "",
    token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
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
