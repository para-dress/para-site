"use client";

import { FormEvent, useState } from "react";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: data.message || "Your enquiry has been sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your enquiry right now.",
      });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="min-h-13 rounded-full border border-white/22 bg-white/10 px-5 text-sm text-white placeholder:text-white/56 outline-none transition focus:border-white/50 focus:bg-white/14"
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className="min-h-13 rounded-full border border-white/22 bg-white/10 px-5 text-sm text-white placeholder:text-white/56 outline-none transition focus:border-white/50 focus:bg-white/14"
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell us which styles you love, your wedding date, or any questions you already have."
        rows={6}
        required
        className="min-h-[164px] w-full resize-none rounded-[1.5rem] border border-white/22 bg-white/10 px-5 py-4 text-sm text-white placeholder:text-white/56 outline-none transition focus:border-white/50 focus:bg-white/14"
      />
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[var(--color-cream)] px-7 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)] shadow-[0_12px_30px_rgba(18,12,8,0.18)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status.type === "loading" ? "Sending..." : "Send enquiry"}
      </button>
      {status.type === "success" ? (
        <p className="text-sm leading-6 text-[#d8f0d2]">{status.message}</p>
      ) : null}
      {status.type === "error" ? (
        <p className="text-sm leading-6 text-[#ffd4d4]">{status.message}</p>
      ) : null}
    </form>
  );
}
