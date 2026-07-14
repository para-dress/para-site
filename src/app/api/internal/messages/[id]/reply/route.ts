import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";
import { META_GRAPH_VERSION } from "@/lib/meta-connect";
import { readStoredMetaConnection } from "@/lib/meta-connect-storage";
import {
  appendSharedMetaWebhookMessage,
  readSharedMetaWebhookInbox,
  writeSharedMetaSendDiagnostic,
} from "@/lib/meta-shared-storage";

const MAX_INSTAGRAM_TEXT_LENGTH = 1000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

type SendMessageResponse = {
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

function maskInstagramId(value: string) {
  return `…${value.slice(-6)}`;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request, { params }: RouteContext) {
  const cookieStore = await cookies();

  if (cookieStore.get(DASHBOARD_COOKIE)?.value !== "active") {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  if (!id.startsWith("webhook:")) {
    return jsonError("Live replies are available only for webhook inbox conversations.", 400);
  }

  const recipientId = id.slice("webhook:".length);
  if (!recipientId || !/^[0-9]+$/.test(recipientId)) {
    return jsonError("Invalid Instagram recipient.", 400);
  }

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return jsonError("Reply text is required.", 400);
  }
  if (text.length > MAX_INSTAGRAM_TEXT_LENGTH) {
    return jsonError(`Reply text must be ${MAX_INSTAGRAM_TEXT_LENGTH} characters or fewer.`, 400);
  }

  const { connection } = await readStoredMetaConnection(cookieStore);
  const instagramAccountId = connection?.instagramAccount?.id;
  const accessToken = connection?.token?.accessToken;
  if (!accessToken) {
    return jsonError("Instagram is not connected. Reconnect the business account and try again.", 503);
  }

  const conversations = await readSharedMetaWebhookInbox();
  const conversation = conversations.find((item) => item.id === recipientId);
  if (!conversation) {
    return jsonError("This Instagram conversation is no longer available in the live inbox.", 404);
  }

  const messagingAccountId = conversation.businessAccountId || instagramAccountId;
  if (!messagingAccountId) {
    return jsonError("The connected Instagram business account ID is unavailable. Send a new customer DM and try again.", 503);
  }

  const endpoint = `https://graph.instagram.com/${META_GRAPH_VERSION}/${messagingAccountId}/messages`;
  let metaResponse: Response;
  let metaData: SendMessageResponse;
  let timestamp = new Date().toISOString();
  try {
    metaResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        recipient_id: recipientId,
        message: text,
        access_token: accessToken,
      }),
      cache: "no-store",
    });
    metaData = (await metaResponse.json().catch(() => ({}))) as SendMessageResponse;
  } catch {
    await writeSharedMetaSendDiagnostic({
      timestamp,
      status: null,
      ok: false,
      endpoint,
      graphApiVersion: META_GRAPH_VERSION,
      senderId: maskInstagramId(messagingAccountId),
      recipientId: maskInstagramId(recipientId),
      error: { type: "NetworkError", message: "Instagram could not be reached." },
    }).catch(() => false);
    return jsonError("Instagram could not be reached. Please try again.", 502);
  }

  timestamp = new Date().toISOString();
  const messageId = metaData.message_id || metaData.id;
  const ok = metaResponse.ok && !metaData.error;
  await writeSharedMetaSendDiagnostic({
    timestamp,
    status: metaResponse.status,
    ok,
    endpoint,
    graphApiVersion: META_GRAPH_VERSION,
    senderId: maskInstagramId(messagingAccountId),
    recipientId: maskInstagramId(recipientId),
    error: metaData.error
      ? {
          code: metaData.error.code,
          error_subcode: metaData.error.error_subcode,
          type: metaData.error.type,
          message: metaData.error.message,
          fbtrace_id: metaData.error.fbtrace_id,
        }
      : null,
    message_id: ok ? messageId : undefined,
  }).catch(() => false);

  if (!ok) {
    return jsonError(metaData.error?.message || "Instagram rejected this reply.", 502);
  }

  timestamp = new Date().toISOString();
  await appendSharedMetaWebhookMessage({
    id: messageId || `outgoing:${timestamp}:${recipientId}`,
    conversationId: recipientId,
    senderId: messagingAccountId,
    recipientId,
    businessAccountId: messagingAccountId,
    direction: "brand",
    text,
    timestamp,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
