import { NextResponse } from "next/server";
import {
  appendSharedMetaWebhookMessage,
  writeSharedMetaWebhookLog,
} from "@/lib/meta-shared-storage";

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
        const messageId = event.message?.mid;
        const text = event.message?.text;
        if (!senderId || !messageId || !text) return [];

        return appendSharedMetaWebhookMessage({
          id: messageId,
          conversationId: senderId,
          senderId,
          senderUsername: event.sender?.username,
          text,
          timestamp: new Date(event.timestamp ?? Date.now()).toISOString(),
        }).catch(() => false);
      }),
    ),
  );

  return NextResponse.json({ received: true }, { status: 200 });
}
