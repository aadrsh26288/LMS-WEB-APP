export type ChatRole = "system" | "user" | "assistant" | "error";

export interface NavigationIntent {
  href: string;
  label: string;
  mode: "link" | "auto";
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  isStreaming?: boolean;
  intent?: NavigationIntent | null;
  error?: string | null;
}
