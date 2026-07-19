import { NextResponse } from "next/server";
import { runDueInstagramObservationJobs } from "@/lib/meta-ai-observation";

export const maxDuration = 60;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDueInstagramObservationJobs();
  return NextResponse.json({ ...result, draftOnly: true });
}
