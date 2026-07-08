import { NextResponse } from "next/server";
import { getDashboardCredentials } from "@/lib/internal-dashboard";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const credentials = getDashboardCredentials();

  if (email !== credentials.email || password !== credentials.password) {
    const redirectUrl = new URL("/internal/login?error=1", request.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/internal", request.url), {
    status: 303,
  });

  response.cookies.set({
    name: DASHBOARD_COOKIE,
    value: "active",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
