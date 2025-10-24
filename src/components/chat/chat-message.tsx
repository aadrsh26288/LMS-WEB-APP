import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ChatMessage } from "@/lib/chat/types";

interface ChatMessageProps {
  message: ChatMessage;
  onIntentNavigate?: (href: string) => void;
}

export function ChatMessageBubble({ message, onIntentNavigate }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  const initials = isUser ? "You" : "LL";

  return (
    <div className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start") }>
      {!isUser ? (
        <Avatar className="h-9 w-9 border shadow-sm">
          <AvatarFallback>LL</AvatarFallback>
        </Avatar>
      ) : null}

      <div
        className={cn(
          "flex max-w-[85%] flex-col space-y-2 sm:max-w-[70%]",
          isUser && "items-end text-right"
        )}
      >
        <div
          className={cn(
            "text-xs font-medium uppercase tracking-wide",
            isUser ? "text-primary" : "text-muted-foreground"
          )}
        >
          {initials}
        </div>
        <Card
          className={cn(
            "shadow-sm",
            isUser
              ? "border-none bg-primary text-primary-foreground"
              : "bg-card text-card-foreground",
            isError && "border-destructive/60 bg-destructive/10 text-destructive"
          )}
        >
          <CardContent className="space-y-3 p-4">
            <MessageContent message={message} />
            {message.intent ? (
              <ActionIntent intent={message.intent} onNavigate={onIntentNavigate} />
            ) : null}
          </CardContent>
        </Card>
      </div>

      {isUser ? (
        <Avatar className="h-9 w-9 border shadow-sm">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}

function MessageContent({ message }: { message: ChatMessage }) {
  if (message.isStreaming && !message.content) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"></span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]"></span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]"></span>
      </div>
    );
  }

  const paragraphs = message.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {paragraphs.length
        ? paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap text-left">
              {paragraph}
            </p>
          ))
        : (
            <p className="whitespace-pre-wrap text-left">
              {message.content || ""}
            </p>
          )}
      {message.isStreaming && message.content ? (
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
      ) : null}
      {message.error ? (
        <Badge variant="destructive" className="mt-2">
          {message.error}
        </Badge>
      ) : null}
    </div>
  );
}

function ActionIntent({
  intent,
  onNavigate,
}: {
  intent: NonNullable<ChatMessage["intent"]>;
  onNavigate?: (href: string) => void;
}) {
  if (!intent) return null;

  const description = intent.description ?? "Continue in the workspace.";

  return (
    <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-left">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <ExternalLink className="h-4 w-4" />
        {intent.mode === "auto" ? "Redirected" : "Ready to navigate"}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="mt-3"
        asChild={intent.mode !== "auto"}
        onClick={intent.mode === "auto" ? () => onNavigate?.(intent.href) : undefined}
      >
        {intent.mode === "auto" ? (
          <span>Open {intent.label}</span>
        ) : (
          <Link href={intent.href}>{intent.label}</Link>
        )}
      </Button>
    </div>
  );
}
