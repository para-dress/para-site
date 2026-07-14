import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  META_CONNECT_STATE_COOKIE,
  MetaTokenExchangeError,
  exchangeInstagramTokenForLongLivedToken,
  exchangeMetaCodeForToken,
  fetchMetaUserProfile,
} from "@/lib/meta-connect";
import {
  clearStoredMetaConnection,
  writeStoredMetaConnection,
} from "@/lib/meta-connect-storage";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error") || url.searchParams.get("error_message");
  const errorDescription =
    url.searchParams.get("error_description") || url.searchParams.get("error_reason");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(META_CONNECT_STATE_COOKIE)?.value;
  const redirectUrl = new URL("/internal/instagram", request.url);

  if (error) {
    redirectUrl.searchParams.set("connect", "error");
    const response = NextResponse.redirect(redirectUrl, { status: 303 });
    await writeStoredMetaConnection(response.cookies, {
      status: "error",
      updatedAt: new Date().toISOString(),
      lastError: errorDescription ? `${error}: ${errorDescription}` : error,
    });
    return response;
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    redirectUrl.searchParams.set("connect", "invalid-state");
    const response = NextResponse.redirect(redirectUrl, { status: 303 });
    await writeStoredMetaConnection(response.cookies, {
      status: "error",
      updatedAt: new Date().toISOString(),
      lastError: !code
        ? "OAuth callback contained no authorization code."
        : !state
          ? "OAuth callback contained no state value."
          : !expectedState
            ? "OAuth state cookie was not present on callback."
            : "OAuth state value did not match the browser cookie.",
    });
    return response;
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  try {
    const now = new Date().toISOString();
    const shortLivedToken = await exchangeMetaCodeForToken(code);
    const longLivedToken = await exchangeInstagramTokenForLongLivedToken(shortLivedToken.access_token);
    const instagramAccount = await fetchMetaUserProfile(longLivedToken.access_token);
    const expiresIn = longLivedToken.expires_in;
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : undefined;

    await writeStoredMetaConnection(response.cookies, {
      status: "connected",
      connectedAt: now,
      updatedAt: now,
      user: {
        id: instagramAccount.id,
        name: instagramAccount.name || instagramAccount.username,
      },
      token: {
        accessToken: longLivedToken.access_token,
        tokenType: "long_lived",
        obtainedAt: now,
        expiresIn,
        expiresAt,
        instagramUserId: longLivedToken.user_id || shortLivedToken.user_id || instagramAccount.id,
      },
      instagramAccount: {
        id: instagramAccount.id,
        username: instagramAccount.username,
        name: instagramAccount.name,
        profilePictureUrl: instagramAccount.profile_picture_url,
      },
    });

    redirectUrl.searchParams.set("connect", "connected");
  } catch (callbackError) {
    await clearStoredMetaConnection(response.cookies);
    await writeStoredMetaConnection(response.cookies, {
      status: "error",
      updatedAt: new Date().toISOString(),
      lastError:
        callbackError instanceof Error
          ? callbackError.message
          : "Unexpected Meta callback error.",
      lastTokenExchangeDiagnostic:
        callbackError instanceof MetaTokenExchangeError
          ? callbackError.diagnostic
          : undefined,
    });
    redirectUrl.searchParams.set("connect", "exchange-failed");
  }

  response.headers.set("Location", redirectUrl.toString());
  response.cookies.set({
    name: META_CONNECT_STATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
