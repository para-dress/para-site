import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(DASHBOARD_COOKIE)?.value === "active";

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/internal/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/internal", "/internal/instagram/:path*", "/internal/messages/:path*"],
};
