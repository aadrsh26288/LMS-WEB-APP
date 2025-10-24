import type { Metadata } from "next";

import { ChatClient } from "@/components/chat/chat-client";

export const metadata: Metadata = {
  title: "Chat Assistant | Luma Learn",
  description:
    "Have conversational control over your LMS workspace with navigation-aware assistance.",
};

export default function ChatPage() {
  return <ChatClient />;
}
