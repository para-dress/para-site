export type AutoReplyDecision =
  | { kind: "reply"; text: string }
  | { kind: "escalate" };

const ESCALATION_PATTERN = /\b(complaint|complain|refund|return|cancel|angry|scam|lawyer|issue|problem|шахра|скарг|повернен|скасув|проблем|обман)\b/i;
const PRICE_PATTERN = /\b(price|cost|how much|pricing|ціна|вартіст|скільки)\b/i;
const CUSTOM_PATTERN = /\b(custom|measurements?|made to measure|розмір|мірк|пошив)\b/i;
const DELIVERY_PATTERN = /\b(delivery|ship|shipping|timeline|how long|достав|термін|коли)\b/i;
const DEPOSIT_PATTERN = /\b(deposit|pay|payment|оплат|завдат)\b/i;

export function decideInstagramAutoReply(message: string): AutoReplyDecision {
  if (ESCALATION_PATTERN.test(message)) {
    return { kind: "escalate" };
  }

  if (PRICE_PATTERN.test(message)) {
    return {
      kind: "reply",
      text: "Our dresses are typically £699–£950, depending on the model. If you send us a photo or tell us which dress you love, we’ll confirm the exact price for you 🤍",
    };
  }

  if (CUSTOM_PATTERN.test(message)) {
    return {
      kind: "reply",
      text: "Yes, custom sizing is available for an additional £100. Production for custom sizing is up to 60 days, and we’ll guide you carefully with measurements before confirming your order 🤍",
    };
  }

  if (DELIVERY_PATTERN.test(message)) {
    return {
      kind: "reply",
      text: "For a standard size, production is up to 50 days. Custom sizing is up to 60 days, then we arrange delivery to the UK. If you tell us the model you love, we can guide you through the next step 🤍",
    };
  }

  if (DEPOSIT_PATTERN.test(message)) {
    return {
      kind: "reply",
      text: "To start an order, we ask for a 50% deposit. Once it is confirmed, we reserve your production slot and guide you through the next steps 🤍",
    };
  }

  return {
    kind: "reply",
    text: "Hi lovely, thank you for messaging Para Dress 🤍 How can we help you find your dream dress?",
  };
}
