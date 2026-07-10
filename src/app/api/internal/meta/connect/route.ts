import { NextResponse } from "next/server";
import {
  META_CONNECT_STATE_COOKIE,
  type MetaScopeSet,
  buildMetaOAuthUrl,
  createMetaState,
  getMetaConnectStatus,
} from "@/lib/meta-connect";

export async function GET(request: Request) {
  const status = getMetaConnectStatus();
  const url = new URL(request.url);
  const scopeSet: MetaScopeSet =
    url.searchParams.get("scopeSet") === "minimal" ? "minimal" : "full";

  if (!status.ready) {
    const redirectUrl = new URL("/internal/instagram", request.url);
    redirectUrl.searchParams.set("setup", status.missing.join(","));
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const state = createMetaState();
  const response = NextResponse.redirect(buildMetaOAuthUrl(state, scopeSet), {
    status: 303,
  });

  response.cookies.set({
    name: META_CONNECT_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  return response;
}
