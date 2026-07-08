import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { META_CONNECT_STATE_COOKIE } from "@/lib/meta-connect";

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

  redirectUrl.searchParams.set("connect", "code-received");
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
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
