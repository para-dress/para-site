export type AutoReplyDecision =
  | { kind: "reply"; text: string }
  | { kind: "escalate" };

const ESCALATION_PATTERN = /\b(complaint|complain|refund|return|cancel|angry|scam|lawyer|issue|problem|шахра|скарг|повернен|скасув|проблем|обман)\b/i;
const PRICE_PATTERN = /\b(price|cost|how much|pricing|ціна|вартіст|скільки)\b/i;
const COLLECTION_PATTERN = /\b(kind.*dresses?|what.*dresses?|styles?|collections?|models?|kind.*gowns?|які.*сукн|стил|колекц|модел)\b/i;
const SIZING_PATTERN = /\b(custom|sizing|size|fit|measurements?|made to measure|розмір|мірк|пошив)\b/i;
const DELIVERY_PATTERN = /\b(delivery|ship|shipping|timeline|how long|достав|термін|коли)\b/i;
const DEPOSIT_PATTERN = /\b(deposit|pay|payment|оплат|завдат)\b/i;

export function decideInstagramAutoReply(message: string): AutoReplyDecision {
  if (ESCALATION_PATTERN.test(message)) {
    return { kind: "escalate" };
  }

  const answers: string[] = [];

  if (COLLECTION_PATTERN.test(message)) {
    answers.push(
      "We have two bridal collections with romantic, minimalist, fitted and A-line styles. If you tell us the silhouette you love — or send an inspiration photo — we’ll show you the closest dresses 🤍",
    );
  }

  if (SIZING_PATTERN.test(message)) {
    answers.push(
      "For sizing, we offer both standard sizes and custom sizing. Custom sizing is an additional £100; we’ll guide you carefully with measurements before confirming your order, so you can feel confident about the fit 🤍",
    );
  }

  if (PRICE_PATTERN.test(message)) {
    answers.push(
      "Our dresses are typically £699–£950, depending on the model. If you send us a photo or tell us which dress you love, we’ll confirm the exact price for you 🤍",
    );
  }

  if (DELIVERY_PATTERN.test(message)) {
    answers.push(
      "For a standard size, production is up to 50 days. Custom sizing is up to 60 days, then we arrange delivery to the UK.",
    );
  }

  if (DEPOSIT_PATTERN.test(message)) {
    answers.push(
      "To start an order, we ask for a 50% deposit. Once it is confirmed, we reserve your production slot and guide you through the next steps.",
    );
  }

  if (answers.length > 0) {
    return { kind: "reply", text: answers.join("\n\n") };
  }

  return {
    kind: "reply",
    text: "Thank you for your message 🤍 To give you the right advice, please tell us the style you love, your wedding date, budget or send an inspiration photo.",
  };
}
