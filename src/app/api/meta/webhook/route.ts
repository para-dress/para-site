import { NextResponse } from "next/server";
import {
  appendSharedMetaWebhookMessage,
  readSharedMetaConnection,
  writeSharedMetaWebhookLog,
} from "@/lib/meta-shared-storage";
import { META_GRAPH_VERSION } from "@/lib/meta-connect";

function getWebhookVerifyToken() {
  return process.env.META_WEBHOOK_VERIFY_TOKEN ?? "";
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
      ? (payload as { entry: Array<{ messaging?: unknown[] }> }).entry
      : [];

  await Promise.all(
    entries.flatMap((entry) =>
      (entry.messaging ?? []).flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const event = candidate as {
          sender?: { id?: string; username?: string };
          recipient?: { id?: string };
          timestamp?: number;
          message?: { mid?: string; text?: string };
        };
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;
        const messageId = event.message?.mid;
        const text = event.message?.text;
        if (!senderId || !messageId || !text) return [];

        return (async () => {
          const connection = await readSharedMetaConnection();
          const brandId = connection?.instagramAccount?.id;
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

          return appendSharedMetaWebhookMessage({
            id: messageId,
            conversationId: brandId && senderId === brandId ? recipientId || senderId : senderId,
            senderId,
            recipientId,
            senderUsername,
            senderName,
            direction: brandId && senderId === brandId ? "brand" : "customer",
            text,
            timestamp: new Date(event.timestamp ?? Date.now()).toISOString(),
          });
        })().catch(() => false);
      }),
    ),
  );

  return NextResponse.json({ received: true }, { status: 200 });
}
