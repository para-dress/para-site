import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/internal/login", request.url), {
    status: 303,
  });

  response.cookies.set({
    name: DASHBOARD_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
