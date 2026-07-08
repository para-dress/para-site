import { cookies } from "next/headers";
import { DASHBOARD_COOKIE } from "@/lib/internal-dashboard-constants";

export type Conversation = {
  id: string;
  handle: string;
  name: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: Array<{
    id: string;
    sender: "customer" | "brand";
    text: string;
    at: string;
  }>;
  aiDraft: string;
};

export const dashboardAccount = {
  businessName: "Para Dress",
  username: "@para.dress",
  accountType: "Instagram Professional Account",
  accountId: "17841400000000000",
  profileImage: "/favicon.png",
  connectionStatus: "Connected",
  connectedAt: "07 Jul 2026, 20:10 UTC",
};

export const dashboardConversations: Conversation[] = [
  {
    id: "amelia",
    handle: "@amelia.wed",
    name: "Amelia",
    lastMessage: "Can you tell me the delivery time for standard sizing to the UK?",
    lastAt: "21:04",
    unread: 1,
    aiDraft:
      "Hi Amelia, yes — for a standard size the production timeline is up to 50 days, and we can then arrange delivery to the UK. If you want, I can also help you choose the best size before ordering.",
    messages: [
      {
        id: "a1",
        sender: "customer",
        text: "Hi! I love one of your dresses. Do you ship to the UK?",
        at: "20:57",
      },
      {
        id: "a2",
        sender: "brand",
        text: "Hi Amelia, yes — we work with brides across the UK and can guide you through the full order process online.",
        at: "20:59",
      },
      {
        id: "a3",
        sender: "customer",
        text: "Can you tell me the delivery time for standard sizing to the UK?",
        at: "21:04",
      },
    ],
  },
  {
    id: "sophie",
    handle: "@sophiebride",
    name: "Sophie",
    lastMessage: "Do you offer custom sizing if I send my measurements?",
    lastAt: "20:42",
    unread: 0,
    aiDraft:
      "Yes, we do offer custom sizing. It is available for an additional £100, and the production timeline is up to 60 days. We’ll guide you carefully on how to take your measurements correctly before we confirm the order.",
    messages: [
      {
        id: "s1",
        sender: "customer",
        text: "Do you offer custom sizing if I send my measurements?",
        at: "20:42",
      },
    ],
  },
  {
    id: "lily",
    handle: "@lily.rose",
    name: "Lily",
    lastMessage: "What deposit do you need to start the order?",
    lastAt: "19:31",
    unread: 0,
    aiDraft:
      "To start the order we ask for a 50% deposit. Once that is confirmed, we can reserve your production slot and guide you through the next steps.",
    messages: [
      {
        id: "l1",
        sender: "customer",
        text: "What deposit do you need to start the order?",
        at: "19:31",
      },
    ],
  },
];

export async function isDashboardAuthenticated() {
  const store = await cookies();
  return store.get(DASHBOARD_COOKIE)?.value === "active";
}

export function getDashboardCredentials() {
  return {
    email: process.env.PARA_DASHBOARD_EMAIL ?? "hello@paradress.co.uk",
    password: process.env.PARA_DASHBOARD_PASSWORD ?? "ParaDressReview2026!",
  };
}

export function findConversation(id: string) {
  return dashboardConversations.find((conversation) => conversation.id === id);
}
