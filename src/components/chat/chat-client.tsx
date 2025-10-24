'use client';

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { ChatMessageBubble } from "./chat-message";
import type { ChatMessage, NavigationIntent } from "@/lib/chat/types";

interface ServerEventToken {
  type: "token" | "intent" | "final" | "error";
  value?: string;
  intent?: NavigationIntent;
  error?: string;
}

const quickPrompts = [
  "Draft a welcome announcement for the new cohort",
  "Summarize learner progress for the Fundamentals course",
  "Show me where to upload next week's lesson plan",
  "Help me schedule office hours for Tuesday",
];

const initialAssistantMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hi there! I'm your Luma Learn assistant. Ask me about course operations, learner progress, or anything else you need. You can also say things like ‘Take me to the gradebook’ and I'll guide you there.",
  createdAt: Date.now(),
};

function createClientMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

export function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeController, setActiveController] = useState<AbortController | null>(null);
  const [_, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(value?: string) {
    const draft = typeof value === "string" ? value : inputValue;
    const trimmed = draft.trim();

    if (!trimmed || isSending) {
      return;
    }

    const userMessage = createClientMessage("user", trimmed);
    const assistantPlaceholder: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
      intent: null,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInputValue("");

    const controller = new AbortController();
    setActiveController(controller);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter((message) => message.role === "assistant" || message.role === "user")
              .map(({ role, content }) => ({ role, content })),
            { role: "user", content: trimmed },
          ],
          context: {
            product: "Luma Learn LMS",
            focus: pathname,
            preferredTone: "friendly",
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to connect to the assistant service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let autoNavigationHandled = false;

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;
          const line = event.trim();
          if (!line.startsWith("data:")) continue;

          const payloadString = line.slice(5).trim();
          if (!payloadString || payloadString === "[DONE]") continue;

          let payload: ServerEventToken | null = null;
          try {
            payload = JSON.parse(payloadString) as ServerEventToken;
          } catch (error) {
            console.error("Failed to parse stream payload", error);
            continue;
          }

          if (!payload) continue;

          if (payload.type === "token" && typeof payload.value === "string") {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantPlaceholder.id
                  ? {
                      ...message,
                      content: `${message.content}${payload!.value}`,
                      isStreaming: true,
                    }
                  : message
              )
            );
          }

          if (payload.type === "intent" && payload.intent) {
            const intent = payload.intent;
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantPlaceholder.id
                  ? { ...message, intent, isStreaming: false }
                  : message
              )
            );

            if (intent.mode === "auto" && !autoNavigationHandled) {
              autoNavigationHandled = true;
              startTransition(() => {
                if (intent.href !== pathname) {
                  router.push(intent.href);
                }
              });
            }
          }

          if (payload.type === "error" && payload.error) {
            throw new Error(payload.error);
          }
        }
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantPlaceholder.id
            ? { ...message, isStreaming: false }
            : message
        )
      );
    } catch (error) {
      const description =
        error instanceof Error && error.name === "AbortError"
          ? "Request cancelled"
          : error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantPlaceholder.id
            ? {
                ...message,
                role: "error",
                isStreaming: false,
                content: "I couldn't complete that request.",
                error: description,
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
      setActiveController(null);
    }
  }

  function handleQuickPrompt(prompt: string) {
    handleSubmit(prompt).catch((error) => {
      console.error("Failed to send quick prompt", error);
    });
  }

  function handleCancel() {
    if (activeController) {
      activeController.abort();
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Card className="border-none bg-gradient-to-br from-background via-background to-muted/80 shadow-xl shadow-primary/5">
        <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-2 w-fit gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Intelligent chat
            </Badge>
            <CardTitle className="text-2xl font-semibold">Ask Luma</CardTitle>
            <CardDescription>
              Chat in natural language to surface insights, navigate the dashboard, or draft learner comms.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">Under 5s avg. response</span>
            <span className="rounded-full bg-muted px-3 py-1">Understands LMS tasks</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isSending}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <Separator />
          <div className="flex max-h-[520px] flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  onIntentNavigate={(href) => router.push(href)}
                />
              ))}
              <div ref={scrollRef} />
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
            className="space-y-3"
          >
            <Textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask about learner progress, publishing content, or navigating the LMS."
              className="min-h-[88px] resize-none"
              disabled={isSending}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {isSending ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                    Cancel response
                  </Button>
                ) : (
                  <span>Tip: Mention a page (“Take me to Courses”) to jump there instantly.</span>
                )}
              </div>
              <Button type="submit" disabled={isSending || !inputValue.trim()}>
                Send message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed bg-muted/40">
        <CardHeader>
          <CardTitle className="text-lg">What the assistant knows</CardTitle>
          <CardDescription>
            Luma Learn guidance, course launch playbooks, weekly reporting helpers, and general productivity tips.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <p className="font-semibold text-foreground">LMS shortcuts</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Grades, attendance, and learner feedback</li>
              <li>Content publishing workflows</li>
              <li>Automated reminder templates</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">General knowledge</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Scheduling and time management best practices</li>
              <li>Communication cadences for cohorts</li>
              <li>Troubleshooting common learner issues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
