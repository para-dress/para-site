import { NextResponse } from "next/server";
import { writeSharedMetaWebhookLog } from "@/lib/meta-shared-storage";

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

  return NextResponse.json({ received: true }, { status: 200 });
}
