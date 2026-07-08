import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/internal") || pathname === "/internal/login") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(DASHBOARD_COOKIE)?.value === "active";

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/internal/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/internal/:path*"],
};
