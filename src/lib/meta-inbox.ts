import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { readStoredMetaConnection, type StoredMetaConnection } from "@/lib/meta-connect-storage";
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
    name?: string;
    username?: string;
  };
};

type InboxIdentityContext = {
  businessIds: Set<string>;
  brandLabels: Set<string>;
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
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function createIdentityContext(connection?: StoredMetaConnection | null): InboxIdentityContext {
  const businessIds = new Set(
    [connection?.instagramAccount?.id, connection?.page?.id].filter(
      (id): id is string => Boolean(id),
    ),
  );
  const brandLabels = new Set(
    [connection?.instagramAccount?.username, connection?.instagramAccount?.name, connection?.page?.name]
      .filter((label): label is string => Boolean(label))
      .map((label) => label.trim().toLowerCase()),
  );

  return { businessIds, brandLabels };
}

function unknownInstagramUser(id?: string) {
  return `Instagram user · …${id?.slice(-6) || "unknown"}`;
}

function isBrandIdentity(value: string | undefined, context: InboxIdentityContext) {
  return Boolean(value && context.brandLabels.has(value.trim().toLowerCase()));
}

function customerIdentity(
  id: string | undefined,
  name: string | undefined,
  username: string | undefined,
  context: InboxIdentityContext,
) {
  const safeUsername = isBrandIdentity(username, context) ? undefined : username;
  const safeName = isBrandIdentity(name, context) ? undefined : name;
  const fallback = unknownInstagramUser(id);

  return {
    handle: safeUsername ? `@${safeUsername}` : fallback,
    name: safeName || safeUsername || fallback,
  };
}

function customerParticipant(conversation: MetaConversationNode, context: InboxIdentityContext) {
  return conversation.participants?.data?.find((participant) => !context.businessIds.has(participant.id));
}

function buildConversationCard(
  conversation: MetaConversationNode,
  messages: MetaMessageNode[],
  context: InboxIdentityContext,
): Conversation {
  const participant = customerParticipant(conversation, context);
  const identity = customerIdentity(participant?.id, participant?.name, participant?.username, context);
  const lastMessage = messages.at(-1);

  return {
    id: conversation.id,
    ...identity,
    lastMessage: lastMessage?.message || "No text message available yet.",
    lastAt: formatClock(lastMessage?.created_time || conversation.updated_time),
    unread: 0,
    aiDraft:
      "Thanks for your message — I’m checking the details for you now and will send the clearest next step in just a moment.",
    messages: messages.map((message) => ({
      id: message.id,
      sender: message.from?.id && context.businessIds.has(message.from.id) ? "brand" : "customer",
      text: message.message || "[Unsupported attachment/message type]",
      at: formatClock(message.created_time),
    })),
  };
}

function buildWebhookConversationCard(
  conversation: StoredMetaWebhookConversation,
  context: InboxIdentityContext,
): Conversation {
  const identity = customerIdentity(
    conversation.id,
    conversation.senderName,
    conversation.senderUsername,
    context,
  );

  return {
    // Keep this recipient IGSID routeable: the reply endpoint intentionally accepts only webhook IDs.
    id: `webhook:${conversation.id}`,
    ...identity,
    lastMessage: conversation.lastMessage,
    lastAt: formatClock(conversation.updatedAt),
    unread: conversation.unread,
    aiDraft:
      "Thanks for your message — I’m checking the details for you now and will send the clearest next step in just a moment.",
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender:
        message.senderId && context.businessIds.has(message.senderId)
          ? "brand"
          : message.recipientId && context.businessIds.has(message.recipientId)
            ? "customer"
            // Webhook records written before business IDs were stored retain their recorded direction.
            : message.direction === "brand"
              ? "brand"
              : "customer",
      text: message.text,
      at: formatClock(message.timestamp),
    })),
  };
}

function graphCustomerId(conversation: MetaConversationNode, context: InboxIdentityContext) {
  return customerParticipant(conversation, context)?.id;
}

function mergeLiveConversations(
  webhookConversations: StoredMetaWebhookConversation[],
  graphConversations: Array<{ node: MetaConversationNode; card: Conversation }>,
  context: InboxIdentityContext,
) {
  // Webhook cards are authoritative because their IDs are recipient IGSIDs accepted by POST /reply.
  const webhookCards = webhookConversations.map((conversation) =>
    buildWebhookConversationCard(conversation, context),
  );
  const webhookCustomerIds = new Set(webhookConversations.map((conversation) => conversation.id));
  const unmatchedGraphCards = graphConversations
    .filter(({ node }) => {
      const customerId = graphCustomerId(node, context);
      return !customerId || !webhookCustomerIds.has(customerId);
    })
    .map(({ card }) => card);

  return [...webhookCards, ...unmatchedGraphCards];
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
  const context = createIdentityContext(connection);
  const webhookConversations = await readSharedMetaWebhookInbox();

  if (!instagramAccessToken || !instagramAccountId) {
    if (webhookConversations.length > 0) {
      return {
        source: "live",
        conversations: webhookConversations.map((conversation) => buildWebhookConversationCard(conversation, context)),
        warning: "Showing live webhook messages. Reconnect Instagram before sending replies.",
      };
    }

    return {
      source: "demo",
      warning:
        !hasSharedMetaStorageConfig()
          ? "Live inbox is using demo data because Vercel KV is not configured yet. Add KV env vars, reconnect Instagram, and the shared token will become visible to all reviewer sessions."
          : "Live inbox is using demo data because no shared Meta token is stored yet. Reconnect Instagram to capture a fresh token.",
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

    const graphConversations = await Promise.all(
      (data.data ?? []).map(async (node) => {
        const messages = await fetchConversationMessages(instagramAccessToken, node.id);
        return { node, card: buildConversationCard(node, messages, context) };
      }),
    );
    const conversations = mergeLiveConversations(webhookConversations, graphConversations, context);

    return {
      source: "live",
      conversations,
      warning:
        conversations.length === 0
          ? "Meta connect is live, but no Instagram conversations were returned yet."
          : undefined,
    };
  } catch (error) {
    if (webhookConversations.length > 0) {
      return {
        source: "live",
        conversations: webhookConversations.map((conversation) => buildWebhookConversationCard(conversation, context)),
        warning: "Showing live webhook messages while Meta conversation sync is unavailable.",
      };
    }

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
  const context = createIdentityContext(connection);

  if (conversationId.startsWith("webhook:")) {
    const webhookConversations = await readSharedMetaWebhookInbox();
    const stored = webhookConversations.find((item) => `webhook:${item.id}` === conversationId);
    return {
      source: "live",
      conversation: stored ? buildWebhookConversationCard(stored, context) : null,
    };
  }

  if (!instagramToken) {
    return {
      source: "demo",
      warning:
        !hasSharedMetaStorageConfig()
          ? "Live conversation is using demo data because Vercel KV is not configured yet. Add KV env vars, reconnect Instagram, and the shared token will become visible to all reviewer sessions."
          : "Live conversation is using demo data because no shared Meta token is stored yet. Reconnect Instagram to capture a fresh token.",
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
      conversation: buildConversationCard(conversationNode, messages, context),
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
