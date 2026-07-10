import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";
import {
  META_GRAPH_VERSION,
  debugMetaToken,
  fetchMetaJsonWithResponse,
} from "@/lib/meta-connect";
import {
  getSharedStorageEnvPresence,
  getSharedStorageRuntimeInfo,
  readSharedMetaWebhookLog,
  runSharedStorageHealthcheck,
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
  const pageToken = connection?.page?.accessToken;
  const instagramAccountId = connection?.instagramAccount?.id;
  const includeLiveTest = new URL(request.url).searchParams.get("live") === "1";
  const webhookLog = await readSharedMetaWebhookLog().catch(() => null);
  const storageRuntime = getSharedStorageRuntimeInfo();
  const storageHealth = await runSharedStorageHealthcheck().catch(() => ({
    configured: false,
    write: false,
    read: false,
    delete: false,
  }));

  const [userTokenDebug, pageTokenDebug] = await Promise.all([
    userToken ? debugMetaToken(userToken).catch(() => null) : Promise.resolve(null),
    pageToken ? debugMetaToken(pageToken).catch(() => null) : Promise.resolve(null),
  ]);

  const response: Record<string, unknown> = {
    connectionExists: Boolean(connection),
    storageSource: source,
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
    pageAccessTokenStored: redactTokenState(pageToken),
    userTokenDebug: userTokenDebug
      ? {
          app_id: userTokenDebug.app_id,
          user_id: userTokenDebug.user_id,
          scopes: userTokenDebug.scopes,
          granular_scopes: userTokenDebug.granular_scopes,
          expires_at: userTokenDebug.expires_at,
          data_access_expires_at: userTokenDebug.data_access_expires_at,
        }
      : null,
    pageTokenDebug: pageTokenDebug
      ? {
          app_id: pageTokenDebug.app_id,
          user_id: pageTokenDebug.user_id,
          scopes: pageTokenDebug.scopes,
          granular_scopes: pageTokenDebug.granular_scopes,
          expires_at: pageTokenDebug.expires_at,
          data_access_expires_at: pageTokenDebug.data_access_expires_at,
        }
      : null,
    webhook: {
      endpoint: `${new URL(request.url).origin}/api/meta/webhook`,
      lastEvent: webhookLog,
    },
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
    },
  };

  if (includeLiveTest) {
    if (!instagramAccountId || !pageToken) {
      response.liveConversationsTest = {
        attempted: false,
        blocked: true,
        reason: !instagramAccountId
          ? "Missing Instagram account ID in stored connection"
          : "Missing page access token in stored connection",
      };

      return NextResponse.json(response, { status: 200 });
    }

    const metaResponse = await fetchMetaJsonWithResponse<{ data?: unknown[] }>(
      `/${instagramAccountId}/conversations`,
      new URLSearchParams({
        access_token: pageToken,
        fields: "id,updated_time,participants{id,name,username}",
        limit: "20",
      }),
    );

    response.liveConversationsTest = {
      attempted: true,
      endpoint: `https://graph.facebook.com/${META_GRAPH_VERSION}/${instagramAccountId}/conversations?fields=id,updated_time,participants{id,name,username}&limit=20`,
      status: metaResponse.status,
      ok: metaResponse.ok,
      conversationCount: Array.isArray(metaResponse.data?.data) ? metaResponse.data.data.length : null,
      error: metaResponse.data?.error
        ? {
            message: metaResponse.data.error.message,
            type: metaResponse.data.error.type,
            code: metaResponse.data.error.code,
            error_subcode: metaResponse.data.error.error_subcode,
            fbtrace_id: metaResponse.data.error.fbtrace_id,
          }
        : null,
    };
  }

  return NextResponse.json(response, { status: 200 });
}
