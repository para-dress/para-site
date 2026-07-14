import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";
import { META_GRAPH_VERSION } from "@/lib/meta-connect";
import {
  clearSharedStorageTestRecord,
  getSharedStorageEnvPresence,
  getSharedStorageRuntimeInfo,
  readSharedMetaWebhookLog,
  readSharedMetaSendDiagnostic,
  readSharedStorageTestRecord,
  runSharedStorageHealthcheck,
  writeSharedStorageTestRecord,
} from "@/lib/meta-shared-storage";
import { readStoredMetaConnection } from "@/lib/meta-connect-storage";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function redactTokenState(value?: string) {
  return value ? "yes" : "no";
}

export async function GET(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(DASHBOARD_COOKIE)?.value !== "active") {
    return unauthorized();
  }

  const { connection, source } = await readStoredMetaConnection(cookieStore);
  const userToken = connection?.token?.accessToken;
  const instagramAccountId = connection?.instagramAccount?.id;
  const url = new URL(request.url);
  const includeLiveTest = url.searchParams.get("live") === "1";
  const includeSubscriptionDiagnostic = url.searchParams.get("subscribedApps") === "1";
  const stickyStorageAction = url.searchParams.get("stickyStorage");
  const webhookLog = await readSharedMetaWebhookLog().catch(() => null);
  const lastSendDiagnostic = await readSharedMetaSendDiagnostic().catch(() => null);
  const storageRuntime = getSharedStorageRuntimeInfo();
  const storageHealth = await runSharedStorageHealthcheck().catch(() => ({
    configured: false,
    write: false,
    read: false,
    delete: false,
  }));

  if (stickyStorageAction === "clear") {
    await clearSharedStorageTestRecord().catch(() => false);
  }

  const stickyRecord =
    stickyStorageAction === "write"
      ? await writeSharedStorageTestRecord().catch(() => null)
      : await readSharedStorageTestRecord().catch(() => null);

  const response: Record<string, unknown> = {
    connectionExists: Boolean(connection),
    storageSource: source,
    connectionStatus: connection?.status ?? null,
    lastConnectionError: connection?.lastError ?? null,
    page: connection?.page
      ? {
          id: connection.page.id,
          name: connection.page.name,
        }
      : null,
    instagramAccount: connection?.instagramAccount
      ? {
          id: connection.instagramAccount.id,
          username: connection.instagramAccount.username,
        }
      : null,
    connectedFacebookUser: connection?.user
      ? {
          id: connection.user.id,
          name: connection.user.name,
        }
      : null,
    userTokenStored: redactTokenState(userToken),
    instagramAccessTokenStored: redactTokenState(userToken),
    webhook: {
      endpoint: `${new URL(request.url).origin}/api/meta/webhook`,
      lastEvent: webhookLog,
    },
    lastSendDiagnostic,
    storage: {
      ...storageRuntime,
      configured: storageHealth.configured,
      env: getSharedStorageEnvPresence().map((entry) => ({
        variable: entry.variable,
        present: entry.present ? "yes" : "no",
        environment: storageRuntime.environment,
      })),
      writeTest: storageHealth.write ? "pass" : "fail",
      readTest: storageHealth.read ? "pass" : "fail",
      deleteTest: storageHealth.delete ? "pass" : "fail",
      stickyRecord,
    },
  };

  if (includeSubscriptionDiagnostic) {
    if (!userToken) {
      response.subscriptionDiagnostic = {
        status: null,
        ok: false,
        appSubscribed: false,
        subscribed_fields: [],
        error: {
          code: undefined,
          error_subcode: undefined,
          message: "Missing stored Instagram access token",
          fbtrace_id: undefined,
        },
      };
    } else {
      const endpoint = `https://graph.instagram.com/${META_GRAPH_VERSION}/me/subscribed_apps`;
      const metaResponse = await fetch(`${endpoint}?${new URLSearchParams({
        access_token: userToken,
      })}`, { cache: "no-store" });
      const data = (await metaResponse.json().catch(() => ({}))) as {
        data?: Array<{ id?: string; subscribed_fields?: string[] }>;
        error?: { code?: number; error_subcode?: number; message?: string; fbtrace_id?: string };
      };
      const app = data.data?.find((item) => item.id === process.env.META_APP_ID);

      response.subscriptionDiagnostic = {
        status: metaResponse.status,
        ok: metaResponse.ok && !data.error,
        appSubscribed: Boolean(app),
        subscribed_fields: app?.subscribed_fields ?? [],
        error: data.error
          ? {
              code: data.error.code,
              error_subcode: data.error.error_subcode,
              message: data.error.message,
              fbtrace_id: data.error.fbtrace_id,
            }
          : null,
      };
    }
  }

  if (includeLiveTest) {
    if (!instagramAccountId || !userToken) {
      response.liveConversationsTest = {
        attempted: false,
        blocked: true,
        reason: !instagramAccountId
          ? "Missing Instagram account ID in stored connection"
          : "Missing Instagram access token in stored connection",
      };

      return NextResponse.json(response, { status: 200 });
    }

    const endpoint = `https://graph.instagram.com/${META_GRAPH_VERSION}/${instagramAccountId}/conversations`;
    const metaResponse = await fetch(`${endpoint}?${new URLSearchParams({
      access_token: userToken,
      fields: "id,updated_time,participants{id,name,username}",
      limit: "20",
    })}`, { cache: "no-store" });
    const data = (await metaResponse.json()) as { data?: unknown[]; error?: { message?: string; type?: string; code?: number; error_subcode?: number; fbtrace_id?: string } };

    response.liveConversationsTest = {
      attempted: true,
      endpoint: `${endpoint}?fields=id,updated_time,participants{id,name,username}&limit=20`,
      status: metaResponse.status,
      ok: metaResponse.ok && !data.error,
      conversationCount: Array.isArray(data.data) ? data.data.length : null,
      error: data.error
        ? {
            message: data.error.message,
            type: data.error.type,
            code: data.error.code,
            error_subcode: data.error.error_subcode,
            fbtrace_id: data.error.fbtrace_id,
          }
        : null,
    };
  }

  return NextResponse.json(response, { status: 200 });
}
