import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearStoredMetaConnection } from "@/lib/meta-connect-storage";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

function redirectToInstagram(request: Request, reset: string) {
  const redirectUrl = new URL("/internal/instagram", request.url);
  redirectUrl.searchParams.set("reset", reset);
  return redirectUrl;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(DASHBOARD_COOKIE)?.value !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.redirect(redirectToInstagram(request, "cleared"), {
    status: 303,
  });

  await clearStoredMetaConnection(response.cookies);
  return response;
}
