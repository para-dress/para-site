import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Contact form is not configured yet. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to enable submissions.",
        },
        { status: 500 },
      );
    }

    const text = [
      "<b>New Para Dress enquiry</b>",
      "",
      `<b>Name:</b> ${escapeHtml(name)}`,
      `<b>Email:</b> ${escapeHtml(email)}`,
      "",
      `<b>Message:</b>\n${escapeHtml(message)}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    const telegramData = (await telegramResponse.json()) as {
      ok?: boolean;
      description?: string;
    };

    if (!telegramResponse.ok || !telegramData.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: telegramData.description || "Telegram delivery failed.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Your enquiry has been sent. We will get back to you soon.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We could not process your enquiry right now." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
