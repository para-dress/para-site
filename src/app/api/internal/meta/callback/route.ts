import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  META_CONNECT_STATE_COOKIE,
  exchangeMetaCodeForToken,
  fetchInstagramAccountForPage,
  fetchMetaPages,
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
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(META_CONNECT_STATE_COOKIE)?.value;
  const redirectUrl = new URL("/internal/instagram", request.url);

  if (error) {
    redirectUrl.searchParams.set("connect", "error");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    redirectUrl.searchParams.set("connect", "invalid-state");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  try {
    const now = new Date().toISOString();
    const token = await exchangeMetaCodeForToken(code);
    const user = await fetchMetaUserProfile(token.access_token);
    const pages = await fetchMetaPages(token.access_token);
    const selectedPage = pages[0];
    const instagramAccount = selectedPage
      ? await fetchInstagramAccountForPage(selectedPage).catch(() => null)
      : null;

    writeStoredMetaConnection(response.cookies, {
      status: "connected",
      connectedAt: now,
      updatedAt: now,
      user,
      token: {
        accessToken: token.access_token,
        tokenType: token.token_type,
        expiresIn: token.expires_in,
      },
      page: selectedPage
        ? {
            id: selectedPage.id,
            name: selectedPage.name,
            accessToken: selectedPage.access_token,
            tasks: selectedPage.tasks,
          }
        : undefined,
      instagramAccount: instagramAccount
        ? {
            id: instagramAccount.id,
            username: instagramAccount.username,
            name: instagramAccount.name,
            profilePictureUrl: instagramAccount.profile_picture_url,
          }
        : undefined,
      pageOptions: pages.map((page) => ({
        id: page.id,
        name: page.name,
      })),
    });

    redirectUrl.searchParams.set("connect", "connected");
  } catch (callbackError) {
    clearStoredMetaConnection(response.cookies);
    writeStoredMetaConnection(response.cookies, {
      status: "error",
      updatedAt: new Date().toISOString(),
      lastError:
        callbackError instanceof Error
          ? callbackError.message
          : "Unexpected Meta callback error.",
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
