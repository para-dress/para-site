import { after, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  appendSharedMetaWebhookMessage,
  claimSharedMetaInboundEvent,
  readSharedMetaConnection,
  writeSharedMetaWebhookLog,
} from "@/lib/meta-shared-storage";
import { getInstagramAiRuntimeConfig, processInstagramObservation } from "@/lib/meta-ai-observation";

function getWebhookVerifyToken() {
  return process.env.META_WEBHOOK_VERIFY_TOKEN ?? "";
}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validWebhookSignature(rawBody: string, signature: string | null) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  const received = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return received.length === expectedBuffer.length && crypto.timingSafeEqual(received, expectedBuffer);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode !== "subscribe" || !challenge) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const expectedToken = getWebhookVerifyToken();

  if (!expectedToken || token !== expectedToken) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!validWebhookSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 403 });
  }
  const payload = JSON.parse(rawBody) as unknown;

  await writeSharedMetaWebhookLog({
    receivedAt: new Date().toISOString(),
    object: payload && typeof payload === "object" && "object" in payload ? String(payload.object) : undefined,
    entryCount:
      payload &&
      typeof payload === "object" &&
      "entry" in payload &&
      Array.isArray((payload as { entry?: unknown[] }).entry)
        ? ((payload as { entry?: unknown[] }).entry?.length ?? 0)
        : 0,
    // Do not retain raw customer payloads in diagnostics.
  }).catch(() => false);

  const entries =
    payload && typeof payload === "object" && "entry" in payload && Array.isArray((payload as { entry?: unknown[] }).entry)
      ? (payload as { entry: Array<{ id?: string; messaging?: unknown[] }> }).entry
      : [];

  await Promise.all(
    entries.flatMap((entry) =>
      (entry.messaging ?? []).flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const event = candidate as {
          sender?: { id?: string; username?: string };
          recipient?: { id?: string };
          timestamp?: number;
          message?: {
            mid?: string;
            text?: string;
            is_echo?: boolean;
            attachments?: Array<{ type?: string; payload?: { url?: string } }>;
          };
        };
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;
        const messageId = event.message?.mid;
        const text = event.message?.text?.trim();
        const attachments = event.message?.attachments;
        if (!senderId || !messageId || (!text && !attachments?.length)) return [];

        return (async () => {
          const connection = await readSharedMetaConnection();
          const isBrandMessage =
            event.message?.is_echo === true ||
            senderId === connection?.token?.instagramUserId ||
            senderId === recipientId;
          if (!isBrandMessage && !(await claimSharedMetaInboundEvent(messageId))) {
            return true;
          }
          // The webhook recipient is the destination Instagram-scoped account ID.
          // It is more reliable for replies than the OAuth profile ID.
          const brandId = recipientId || entry.id || connection?.instagramAccount?.id;
          // Do not make a profile lookup on the webhook path: Meta expects a fast acknowledgement.
          // The sender ID is always stored; a supplied username is retained when Meta provides one.
          const senderUsername = event.sender?.username;
          const senderName = senderUsername;

          await appendSharedMetaWebhookMessage({
            id: messageId,
            conversationId: isBrandMessage ? recipientId || senderId : senderId,
            senderId,
            recipientId,
            businessAccountId: brandId,
            senderUsername,
            senderName,
            direction: isBrandMessage ? "brand" : "customer",
            text: text || `[Attachment: ${attachments?.map((attachment) => attachment.type || "unknown").join(", ")}]`,
            timestamp: new Date(event.timestamp ?? Date.now()).toISOString(),
            attachments: attachments?.map((attachment) => ({
              type: attachment.type,
              url: attachment.payload?.url,
            })),
          });

          if (isBrandMessage) {
            return true;
          }

          // Draft-only: no Instagram sender is called from this webhook.
          // The explicit false check is a safety lock; processing itself never sends.
          after(async () => {
            const { debounceSeconds, autoreplyEnabled } = getInstagramAiRuntimeConfig();
            if (autoreplyEnabled) return;
            await pause(debounceSeconds * 1_000);
            await processInstagramObservation(messageId, senderId);
          });

          return true;
        })().catch(() => false);
      }),
    ),
  );

  return NextResponse.json({ received: true }, { status: 200 });
}
