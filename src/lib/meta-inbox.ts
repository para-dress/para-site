import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { readStoredMetaConnection } from "@/lib/meta-connect-storage";
import { META_GRAPH_VERSION } from "@/lib/meta-connect";
import {
  hasSharedMetaStorageConfig,
  readSharedMetaWebhookInbox,
  type StoredMetaWebhookConversation,
} from "@/lib/meta-shared-storage";
import type { Conversation } from "@/lib/internal-dashboard";

type MetaParticipant = {
  id: string;
  name?: string;
  username?: string;
};

type MetaConversationNode = {
  id: string;
  updated_time?: string;
  participants?: { data?: MetaParticipant[] };
};

type MetaMessageNode = {
  id: string;
  message?: string;
  created_time?: string;
  from?: {
    id?: string;
    username?: string;
  };
};

export type InboxDataSource = "live" | "demo";

export type InboxResult = {
  source: InboxDataSource;
  warning?: string;
  conversations: Conversation[];
};

export type ConversationResult = {
  source: InboxDataSource;
  warning?: string;
  conversation: Conversation | null;
};

function buildGraphUrl(pathname: string, params: URLSearchParams) {
  return `https://graph.instagram.com/${META_GRAPH_VERSION}${pathname}?${params.toString()}`;
}

async function fetchGraph<T>(pathname: string, params: URLSearchParams) {
  const response = await fetch(buildGraphUrl(pathname, params), {
    cache: "no-store",
  });
  const data = (await response.json()) as T & {
    error?: { message?: string };
  };

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Meta inbox request failed for ${pathname}`);
  }

  return data;
}

function formatClock(value?: string) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function buildConversationCard(
  conversation: MetaConversationNode,
  messages: MetaMessageNode[],
  brandId?: string,
): Conversation {
  const participant = conversation.participants?.data?.find((item) => item.id !== brandId);
  const lastMessage = messages.at(-1);

  return {
    id: conversation.id,
    handle: participant?.username ? `@${participant.username}` : "@instagram-user",
    name: participant?.name || participant?.username || "Instagram contact",
    lastMessage: lastMessage?.message || "No text message available yet.",
    lastAt: formatClock(lastMessage?.created_time || conversation.updated_time),
    unread: 0,
    aiDraft:
      "Thanks for your message — I’m checking the details for you now and will send the clearest next step in just a moment.",
    messages: messages.map((message) => ({
      id: message.id,
      sender: message.from?.id === brandId ? "brand" : "customer",
      text: message.message || "[Unsupported attachment/message type]",
      at: formatClock(message.created_time),
    })),
  };
}

function buildWebhookConversationCard(conversation: StoredMetaWebhookConversation): Conversation {
  return {
    id: `webhook:${conversation.id}`,
    handle: conversation.senderUsername ? `@${conversation.senderUsername}` : "@instagram-user",
    name: conversation.senderUsername || "Instagram contact",
    lastMessage: conversation.lastMessage,
    lastAt: formatClock(conversation.updatedAt),
    unread: conversation.unread,
    aiDraft:
      "Thanks for your message — I’m checking the details for you now and will send the clearest next step in just a moment.",
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: "customer",
      text: message.text,
      at: formatClock(message.timestamp),
    })),
  };
}

async function fetchConversationMessages(token: string, conversationId: string) {
  const params = new URLSearchParams({
    access_token: token,
    fields: "id,message,created_time,from",
    limit: "25",
  });

  const data = await fetchGraph<{ data?: MetaMessageNode[] }>(`/${conversationId}/messages`, params);
  return data.data ?? [];
}

export async function fetchLiveInbox(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): Promise<InboxResult | null> {
  const { connection } = await readStoredMetaConnection(cookieStore);
  const instagramAccountId = connection?.instagramAccount?.id;
  const instagramAccessToken = connection?.token?.accessToken;
  const brandId = connection?.instagramAccount?.id;

  if (!connection?.token?.accessToken) {
    return {
      source: "demo",
      warning:
        !hasSharedMetaStorageConfig()
          ? "Live inbox is using demo data because Vercel KV is not configured yet. Add KV env vars, reconnect Instagram, and the shared token will become visible to all reviewer sessions."
          : "Live inbox is using demo data because no shared Meta token is stored yet. Reconnect Instagram to capture a fresh token.",
      conversations: [],
    };
  }

  if (!instagramAccountId || !instagramAccessToken) {
    return {
      source: "demo",
      warning:
        "Live inbox is using demo data because the stored Meta connection is missing the Instagram business account ID or access token. Reconnect Instagram after Vercel KV is configured.",
      conversations: [],
    };
  }

  try {
    const params = new URLSearchParams({
      access_token: instagramAccessToken,
      fields: "id,updated_time,participants{id,name,username}",
      limit: "20",
    });
    const data = await fetchGraph<{ data?: MetaConversationNode[] }>(
      `/${instagramAccountId}/conversations`,
      params,
    );

    const conversations = await Promise.all(
      (data.data ?? []).map(async (conversation) => {
        const messages = await fetchConversationMessages(instagramAccessToken, conversation.id);
        return buildConversationCard(conversation, messages, brandId);
      }),
    );

    const webhookConversations = await readSharedMetaWebhookInbox();
    const resolvedConversations = conversations.length > 0
      ? conversations
      : webhookConversations.map(buildWebhookConversationCard);

    return {
      source: "live",
      conversations: resolvedConversations,
      warning:
        resolvedConversations.length === 0
          ? "Meta connect is live, but no Instagram conversations were returned yet."
          : undefined,
    };
  } catch (error) {
    return {
      source: "demo",
      warning:
        error instanceof Error
          ? `Live inbox could not load from Meta yet: ${error.message}`
          : "Live inbox could not load from Meta yet.",
      conversations: [],
    };
  }
}

export async function fetchLiveConversation(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
  conversationId: string,
): Promise<ConversationResult | null> {
  const { connection } = await readStoredMetaConnection(cookieStore);
  const instagramToken = connection?.token?.accessToken;
  const brandId = connection?.instagramAccount?.id;

  if (conversationId.startsWith("webhook:")) {
    const webhookConversations = await readSharedMetaWebhookInbox();
    const stored = webhookConversations.find((item) => `webhook:${item.id}` === conversationId);
    return {
      source: "live",
      conversation: stored ? buildWebhookConversationCard(stored) : null,
    };
  }

  if (!connection?.token?.accessToken) {
    return {
      source: "demo",
      warning:
        !hasSharedMetaStorageConfig()
          ? "Live conversation is using demo data because Vercel KV is not configured yet. Add KV env vars, reconnect Instagram, and the shared token will become visible to all reviewer sessions."
          : "Live conversation is using demo data because no shared Meta token is stored yet. Reconnect Instagram to capture a fresh token.",
      conversation: null,
    };
  }

  if (!instagramToken) {
    return {
      source: "demo",
      warning:
        "Live conversation is using demo data because the stored Meta connection is missing the Instagram access token. Reconnect Instagram after Vercel KV is configured.",
      conversation: null,
    };
  }

  try {
    const [conversationNode, messages] = await Promise.all([
      fetchGraph<MetaConversationNode>(
        `/${conversationId}`,
        new URLSearchParams({
          access_token: instagramToken,
          fields: "id,updated_time,participants{id,name,username}",
        }),
      ),
      fetchConversationMessages(instagramToken, conversationId),
    ]);

    return {
      source: "live",
      conversation: buildConversationCard(conversationNode, messages, brandId),
    };
  } catch (error) {
    return {
      source: "demo",
      warning:
        error instanceof Error
          ? `Live conversation could not load from Meta yet: ${error.message}`
          : "Live conversation could not load from Meta yet.",
      conversation: null,
    };
  }
}
