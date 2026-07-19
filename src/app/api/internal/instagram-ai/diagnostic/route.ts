import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";
import { getInstagramAiRuntimeConfig, runDueInstagramObservationJobs } from "@/lib/meta-ai-observation";
import { readRecentSharedInstagramAiRuns } from "@/lib/meta-shared-storage";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function authenticated() {
  return (await cookies()).get(DASHBOARD_COOKIE)?.value === "active";
}

export async function GET() {
  if (!(await authenticated())) return unauthorized();
  const config = getInstagramAiRuntimeConfig();
  const runs = await readRecentSharedInstagramAiRuns();
  return NextResponse.json({
    draftOnly: !config.autoreplyEnabled,
    config: {
      model: config.model,
      debounceSeconds: config.debounceSeconds,
      maxHistoryMessages: config.maxHistoryMessages,
      maxOutputTokens: config.maxOutputTokens,
      dailyRequestLimit: config.dailyRequestLimit,
      openaiKeyPresent: Boolean(process.env.OPENAI_API_KEY),
      telegramEnabled: process.env.INSTAGRAM_AI_NOTIFY_TELEGRAM?.trim().toLowerCase() === "true",
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    },
    runs,
  });
}

export async function POST() {
  if (!(await authenticated())) return unauthorized();
  const result = await runDueInstagramObservationJobs();
  return NextResponse.json({ ...result, draftOnly: !getInstagramAiRuntimeConfig().autoreplyEnabled });
}
