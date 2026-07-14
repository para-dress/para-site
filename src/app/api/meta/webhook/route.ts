import { NextResponse } from "next/server";
import {
  appendSharedMetaWebhookMessage,
  claimSharedMetaAutoReply,
  claimSharedMetaAutoReplyText,
  readSharedMetaConnection,
  writeSharedMetaSendDiagnostic,
  writeSharedMetaWebhookLog,
} from "@/lib/meta-shared-storage";
import { META_GRAPH_VERSION } from "@/lib/meta-connect";
import { decideInstagramAutoReply } from "@/lib/meta-auto-reply";

function getWebhookVerifyToken() {
  return process.env.META_WEBHOOK_VERIFY_TOKEN ?? "";
}

function maskInstagramId(value: string) {
  return `…${value.slice(-6)}`;
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
  const payload = await request.json().catch(() => null);

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
    sample:
      payload &&
      typeof payload === "object" &&
      "entry" in payload &&
      Array.isArray((payload as { entry?: unknown[] }).entry)
        ? (payload as { entry?: unknown[] }).entry?.[0] ?? null
        : payload,
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
          message?: { mid?: string; text?: string; is_echo?: boolean };
        };
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;
        const messageId = event.message?.mid;
        const text = event.message?.text;
        if (!senderId || !messageId || !text) return [];

        return (async () => {
          const connection = await readSharedMetaConnection();
          const isBrandMessage =
            event.message?.is_echo === true ||
            senderId === connection?.token?.instagramUserId ||
            senderId === recipientId;
          // The webhook recipient is the destination Instagram-scoped account ID.
          // It is more reliable for replies than the OAuth profile ID.
          const brandId = recipientId || entry.id || connection?.instagramAccount?.id;
          let senderUsername = event.sender?.username;
          let senderName: string | undefined;

          if ((!senderUsername || !senderName) && connection?.token?.accessToken) {
            const profileResponse = await fetch(
              `https://graph.instagram.com/${META_GRAPH_VERSION}/${senderId}?${new URLSearchParams({
                access_token: connection.token.accessToken,
                fields: "id,username,name",
              })}`,
              { cache: "no-store" },
            ).catch(() => null);
            const profile = profileResponse?.ok
              ? await profileResponse.json().catch(() => null) as { username?: string; name?: string } | null
              : null;
            senderUsername = profile?.username ?? senderUsername;
            senderName = profile?.name ?? senderName;
          }

          senderName ??= senderUsername;

          await appendSharedMetaWebhookMessage({
            id: messageId,
            conversationId: isBrandMessage ? recipientId || senderId : senderId,
            senderId,
            recipientId,
            businessAccountId: brandId,
            senderUsername,
            senderName,
            direction: isBrandMessage ? "brand" : "customer",
            text,
            timestamp: new Date(event.timestamp ?? Date.now()).toISOString(),
          });

          if (isBrandMessage || !connection?.token?.accessToken) {
            return true;
          }

          const decision = decideInstagramAutoReply(text);
          if (
            decision.kind === "escalate" ||
            !(await claimSharedMetaAutoReply(messageId)) ||
            !(await claimSharedMetaAutoReplyText(senderId, text))
          ) {
            return true;
          }

          const endpoint = `https://graph.instagram.com/${META_GRAPH_VERSION}/me/messages`;
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${connection.token.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipient: { id: senderId },
              message: { text: decision.text },
            }),
            cache: "no-store",
          }).catch(() => null);
          const data = (response
            ? await response.json().catch(() => ({}))
            : {}) as {
            message_id?: string;
            id?: string;
            error?: {
              code?: number;
              error_subcode?: number;
              type?: string;
              message?: string;
              fbtrace_id?: string;
            };
          };
          const ok = Boolean(response?.ok && !data.error);
          const sentAt = new Date().toISOString();

          await writeSharedMetaSendDiagnostic({
            timestamp: sentAt,
            status: response?.status ?? null,
            ok,
            endpoint,
            graphApiVersion: META_GRAPH_VERSION,
            senderId: "me",
            recipientId: maskInstagramId(senderId),
            error: data.error
              ? {
                  code: data.error.code,
                  error_subcode: data.error.error_subcode,
                  type: data.error.type,
                  message: data.error.message,
                  fbtrace_id: data.error.fbtrace_id,
                }
              : response
                ? null
                : { type: "NetworkError", message: "Instagram could not be reached." },
            message_id: ok ? data.message_id || data.id : undefined,
          });

          if (ok) {
            await appendSharedMetaWebhookMessage({
              id: data.message_id || data.id || `auto:${sentAt}:${senderId}`,
              conversationId: senderId,
              senderId: connection.token.instagramUserId || "me",
              recipientId: senderId,
              businessAccountId: connection.token.instagramUserId,
              direction: "brand",
              text: decision.text,
              timestamp: sentAt,
            });
          }

          return true;
        })().catch(() => false);
      }),
    ),
  );

  return NextResponse.json({ received: true }, { status: 200 });
}
