import crypto from "node:crypto";
import { Redis } from "@upstash/redis";
import {
  normalizeStoredMetaConnection,
  type StoredMetaConnection,
} from "@/lib/meta-connect-storage";

const META_CONNECTION_KV_KEY = "para:meta:connection";
const META_WEBHOOK_LOG_KV_KEY = "para:meta:webhook:last";
const META_WEBHOOK_INBOX_KV_KEY = "para:meta:webhook:inbox";
const META_STORAGE_TEST_KV_KEY = "para:meta:storage:test";
const META_SEND_DIAGNOSTIC_KV_KEY = "para:meta:send-diagnostic:last";
const META_SUBSCRIPTION_DIAGNOSTIC_KV_KEY = "para:meta:subscription-diagnostic:last";
const META_AUTO_REPLY_KV_PREFIX = "para:meta:auto-reply:";
const META_AUTO_REPLY_TEXT_KV_PREFIX = "para:meta:auto-reply-text:";
const META_INBOUND_EVENT_KV_PREFIX = "para:meta:inbound-event:";
const META_AI_DRAFT_KV_PREFIX = "para:meta:ai-draft:";
const META_AI_CONVERSATION_CLAIM_KV_PREFIX = "para:meta:ai-conversation-claim:";
const META_AI_DAILY_REQUEST_KV_PREFIX = "para:meta:ai-daily-request:";
const META_AI_RUN_KV_PREFIX = "para:meta:ai-run:";
const META_AI_RUN_INDEX_KV_KEY = "para:meta:ai-runs:recent";
const META_AI_JOB_KV_PREFIX = "para:meta:ai-job:";
const META_AI_JOB_QUEUE_KV_KEY = "para:meta:ai-jobs:queue";
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
  businessAccountId?: string;
  senderUsername?: string;
  senderName?: string;
  direction: "customer" | "brand";
  text: string;
  timestamp: string;
  attachments?: Array<{
    type?: string;
    url?: string;
  }>;
};

export type StoredInstagramAiDraft = {
  messageId: string;
  conversationId: string;
  createdAt: string;
  status: "ready" | "waiting_for_openai_config" | "daily_request_limit_reached" | "failed";
  pipeline?: "draft_only";
  debounceCompletedAt?: string;
  debounceSeconds?: number;
  historyCount?: number;
  model?: string;
  telegramNotification?: "sent" | "disabled" | "not_configured" | "failed";
  instagramReplySent?: false;
  intent?: string;
  suggestedReply?: string;
  missingInformation?: string;
  ownerActionRequired?: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  error?: string;
};

export type InstagramAiRunStage = {
  status: "pending" | "ok" | "skipped" | "failed";
  at: string;
  httpStatus?: number;
  detail?: string;
  responseShape?: {
    topLevelKeys: string[];
    outputItemCount: number;
    outputItemTypes: string[];
    contentTypes: string[];
    hasOutputText: boolean;
    hasParsedObject: boolean;
  };
};

export type StoredInstagramAiRun = {
  messageId: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  status: "queued" | "processing" | "ready" | "failed" | "skipped";
  webhook: InstagramAiRunStage;
  dedupe: InstagramAiRunStage;
  inbound: InstagramAiRunStage;
  debounce: InstagramAiRunStage & { dueAt?: string };
  history: InstagramAiRunStage & { count?: number };
  openai: InstagramAiRunStage & { model?: string };
  draft: InstagramAiRunStage;
  telegram: InstagramAiRunStage;
  instagramReplySent: false;
};

export type StoredInstagramAiJob = {
  messageId: string;
  conversationId: string;
  dueAt: string;
  createdAt: string;
  attempts: number;
};

export type StoredMetaSendDiagnostic = {
  timestamp: string;
  status: number | null;
  ok: boolean;
  endpoint: string;
  graphApiVersion: string;
  senderId: string;
  recipientId: string;
  error: {
    code?: number;
    error_subcode?: number;
    type?: string;
    message?: string;
    fbtrace_id?: string;
  } | null;
  message_id?: string;
};

export type StoredMetaSubscriptionDiagnostic = {
  timestamp: string;
  status: number | null;
  ok: boolean;
  success: boolean;
  error: {
    code?: number;
    error_subcode?: number;
    type?: string;
    message?: string;
    fbtrace_id?: string;
  } | null;
};

export type StoredMetaWebhookConversation = {
  id: string;
  senderId: string;
  senderUsername?: string;
  senderName?: string;
  businessAccountId?: string;
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
    // Only customer-originated events can establish the customer identity. Outbound
    // webhook events identify the business sender and must not overwrite it.
    senderUsername:
      message.direction === "customer"
        ? message.senderUsername ?? previous?.senderUsername
        : previous?.senderUsername,
    senderName:
      message.direction === "customer"
        ? message.senderName ?? previous?.senderName
        : previous?.senderName,
    businessAccountId: message.businessAccountId ?? previous?.businessAccountId,
    lastMessage: message.text,
    updatedAt: message.timestamp,
    unread: (previous?.unread ?? 0) + (message.direction === "customer" ? 1 : 0),
    messages,
  };
  const next = [conversation, ...existing.filter((item) => item.id !== message.conversationId)].slice(0, 50);

  await redis.set(META_WEBHOOK_INBOX_KV_KEY, next, { ex: META_WEBHOOK_LOG_TTL_SECONDS });
  return true;
}

export async function claimSharedMetaInboundEvent(messageId: string) {
  const redis = getRedisClient();
  if (!redis) return false;

  const result = await redis.set(`${META_INBOUND_EVENT_KV_PREFIX}${messageId}`, "claimed", {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
    nx: true,
  });
  return result === "OK";
}

export async function readSharedMetaWebhookConversation(conversationId: string) {
  const conversations = await readSharedMetaWebhookInbox();
  return conversations.find((conversation) => conversation.id === conversationId) ?? null;
}

export async function claimSharedInstagramAiConversation(conversationId: string) {
  const redis = getRedisClient();
  if (!redis) return false;

  const result = await redis.set(`${META_AI_CONVERSATION_CLAIM_KV_PREFIX}${conversationId}`, "claimed", {
    ex: 15,
    nx: true,
  });
  return result === "OK";
}

export async function claimSharedInstagramAiDailyRequest(limit: number) {
  const redis = getRedisClient();
  if (!redis) return false;

  const date = new Date().toISOString().slice(0, 10);
  const key = `${META_AI_DAILY_REQUEST_KV_PREFIX}${date}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 48);
  }
  return count <= limit;
}

export async function writeSharedInstagramAiDraft(draft: StoredInstagramAiDraft) {
  const redis = getRedisClient();
  if (!redis) return false;

  await redis.set(`${META_AI_DRAFT_KV_PREFIX}${draft.messageId}`, draft, {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
  });
  return true;
}

export async function readSharedInstagramAiDraft(messageId: string) {
  const redis = getRedisClient();
  if (!redis) return null;

  const stored = await redis.get<StoredInstagramAiDraft | string | null>(`${META_AI_DRAFT_KV_PREFIX}${messageId}`);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as StoredInstagramAiDraft;
    } catch {
      return null;
    }
  }
  return stored;
}

async function readJsonRecord<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  const stored = await redis.get<T | string | null>(key);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function writeSharedInstagramAiRun(run: StoredInstagramAiRun) {
  const redis = getRedisClient();
  if (!redis) return false;
  await redis.set(`${META_AI_RUN_KV_PREFIX}${run.messageId}`, run, { ex: META_WEBHOOK_LOG_TTL_SECONDS });
  const current = (await redis.get<string[] | null>(META_AI_RUN_INDEX_KV_KEY)) ?? [];
  const next = [run.messageId, ...current.filter((id) => id !== run.messageId)].slice(0, 10);
  await redis.set(META_AI_RUN_INDEX_KV_KEY, next, { ex: META_WEBHOOK_LOG_TTL_SECONDS });
  return true;
}

export async function readSharedInstagramAiRun(messageId: string) {
  return readJsonRecord<StoredInstagramAiRun>(`${META_AI_RUN_KV_PREFIX}${messageId}`);
}

export async function readRecentSharedInstagramAiRuns() {
  const redis = getRedisClient();
  if (!redis) return [];
  const ids = (await redis.get<string[] | null>(META_AI_RUN_INDEX_KV_KEY)) ?? [];
  const runs = await Promise.all(ids.slice(0, 10).map((id) => readSharedInstagramAiRun(id)));
  return runs.filter((run): run is StoredInstagramAiRun => Boolean(run));
}

export async function enqueueSharedInstagramAiJob(job: StoredInstagramAiJob) {
  const redis = getRedisClient();
  if (!redis) return false;
  await redis.set(`${META_AI_JOB_KV_PREFIX}${job.messageId}`, job, { ex: META_WEBHOOK_LOG_TTL_SECONDS });
  await redis.zadd(META_AI_JOB_QUEUE_KV_KEY, { score: new Date(job.dueAt).getTime(), member: job.messageId });
  await redis.expire(META_AI_JOB_QUEUE_KV_KEY, META_WEBHOOK_LOG_TTL_SECONDS);
  return true;
}

export async function claimDueSharedInstagramAiJobs(now = new Date()) {
  const redis = getRedisClient();
  if (!redis) return [];
  const ids = await redis.zrange(META_AI_JOB_QUEUE_KV_KEY, "-inf", now.getTime(), { byScore: true, offset: 0, count: 10 });
  const claimed: StoredInstagramAiJob[] = [];
  for (const id of ids) {
    const job = await readJsonRecord<StoredInstagramAiJob>(`${META_AI_JOB_KV_PREFIX}${id}`);
    if (!job) {
      await redis.zrem(META_AI_JOB_QUEUE_KV_KEY, id);
      continue;
    }
    const lock = await redis.set(`${META_AI_JOB_KV_PREFIX}${id}:claim`, "claimed", { ex: 55, nx: true });
    if (lock === "OK") {
      claimed.push({ ...job, attempts: job.attempts + 1 });
    }
  }
  return claimed;
}

export async function completeSharedInstagramAiJob(messageId: string) {
  const redis = getRedisClient();
  if (!redis) return false;
  await redis.del(`${META_AI_JOB_KV_PREFIX}${messageId}`, `${META_AI_JOB_KV_PREFIX}${messageId}:claim`);
  await redis.zrem(META_AI_JOB_QUEUE_KV_KEY, messageId);
  return true;
}

export async function readSharedMetaSendDiagnostic() {
  const redis = getRedisClient();
  if (!redis) return null;

  const stored = await redis.get<StoredMetaSendDiagnostic | string | null>(META_SEND_DIAGNOSTIC_KV_KEY);
  if (!stored) return null;

  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as StoredMetaSendDiagnostic;
    } catch {
      return null;
    }
  }

  return stored;
}

export async function writeSharedMetaSendDiagnostic(diagnostic: StoredMetaSendDiagnostic) {
  const redis = getRedisClient();
  if (!redis) return false;

  await redis.set(META_SEND_DIAGNOSTIC_KV_KEY, diagnostic, {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
  });

  return true;
}

export async function claimSharedMetaAutoReply(messageId: string) {
  const redis = getRedisClient();
  if (!redis) return false;

  const result = await redis.set(`${META_AUTO_REPLY_KV_PREFIX}${messageId}`, "claimed", {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
    nx: true,
  });

  return result === "OK";
}

export async function claimSharedMetaAutoReplyText(senderId: string, text: string) {
  const redis = getRedisClient();
  if (!redis) return false;

  const fingerprint = crypto
    .createHash("sha256")
    .update(`${senderId}:${text.trim().toLowerCase()}`)
    .digest("hex");
  const result = await redis.set(`${META_AUTO_REPLY_TEXT_KV_PREFIX}${fingerprint}`, "claimed", {
    ex: 60 * 10,
    nx: true,
  });

  return result === "OK";
}

export async function readSharedMetaSubscriptionDiagnostic() {
  const redis = getRedisClient();
  if (!redis) return null;

  const stored = await redis.get<StoredMetaSubscriptionDiagnostic | string | null>(META_SUBSCRIPTION_DIAGNOSTIC_KV_KEY);
  if (!stored) return null;

  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as StoredMetaSubscriptionDiagnostic;
    } catch {
      return null;
    }
  }

  return stored;
}

export async function writeSharedMetaSubscriptionDiagnostic(diagnostic: StoredMetaSubscriptionDiagnostic) {
  const redis = getRedisClient();
  if (!redis) return false;

  await redis.set(META_SUBSCRIPTION_DIAGNOSTIC_KV_KEY, diagnostic, {
    ex: META_WEBHOOK_LOG_TTL_SECONDS,
  });

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
