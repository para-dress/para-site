# Instagram AI draft-only mode

## Safety lock

The webhook pipeline only stores inbound customer messages and creates an owner-review draft. It contains no Instagram sending call. Keep this setting in every environment:

```dotenv
INSTAGRAM_AI_AUTOREPLY_ENABLED=false
```

Incoming Meta webhook requests must carry a valid `X-Hub-Signature-256`; unsigned or invalid requests are rejected before any storage or processing.

## Required server-side environment variables

```dotenv
META_APP_SECRET=
META_WEBHOOK_VERIFY_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=
OPENAI_API_KEY=
INSTAGRAM_AI_OPENAI_MODEL=
INSTAGRAM_AI_AUTOREPLY_ENABLED=false
INSTAGRAM_AI_NOTIFY_TELEGRAM=true
INSTAGRAM_AI_DEBOUNCE_SECONDS=7
INSTAGRAM_AI_MAX_HISTORY_MESSAGES=20
INSTAGRAM_AI_MAX_OUTPUT_TOKENS=400
INSTAGRAM_AI_DAILY_REQUEST_LIMIT=100
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

`INSTAGRAM_AI_OPENAI_MODEL` is required; there is deliberately no fallback model. `OPENAI_API_KEY` must remain server-side only: never use a `NEXT_PUBLIC_` name, commit it, or include it in logs or Telegram notifications.

## Runtime flow

1. `POST /api/meta/webhook` validates the Meta signature, claims each customer message ID in Redis, and stores the inbound message.
2. Duplicate deliveries are ignored. Brand echoes are stored as history but never trigger AI processing.
3. After `INSTAGRAM_AI_DEBOUNCE_SECONDS`, the latest configured history window is passed to the OpenAI Responses API.
4. OpenAI Structured Outputs returns a validated object with `intent`, `suggestedReply`, `missingInformation`, `ownerActionRequired`, and `priority`.
5. The draft and non-secret processing metadata (history count, configured model, Telegram delivery result, and `instagramReplySent: false`) are stored at `para:meta:ai-draft:<Meta message ID>` in Redis for seven days.
6. When enabled, Telegram receives the owner-review notification. No Instagram reply is sent.

Draft processing records `waiting_for_openai_config`, `daily_request_limit_reached`, or `failed` instead of sending anything when configuration or execution is unavailable.
