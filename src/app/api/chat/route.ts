import { NextResponse } from "next/server";
import OpenAI from "openai";

import { detectNavigationIntent } from "@/lib/chat/intent";
import type { NavigationIntent } from "@/lib/chat/types";

export const runtime = "nodejs";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

interface ChatPayload {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  context?: Record<string, unknown>;
}

interface AssistantResponse {
  answer: string;
  intent: NavigationIntent | null;
  isOutOfScope?: boolean;
}

function isInScopeQuestion(question: string): boolean {
  const normalized = question.toLowerCase();
  return (
    /upload|material|lesson|resource/.test(normalized) ||
    /progress|status|completion|report/.test(normalized) ||
    /office hour|schedule|calendar|meeting/.test(normalized) ||
    /announcement|message|communication/.test(normalized) ||
    /support|trouble|issue|ticket/.test(normalized) ||
    /course|curriculum|module|dashboard|overview|home|chat|assistant|ask luma/.test(normalized)
  );
}

async function buildAssistantResponse(
  question: string,
  _context?: Record<string, unknown>
): Promise<AssistantResponse> {
  const normalized = question.toLowerCase();
  let answer = "";
  let isOutOfScope = false;

  if (/upload|material|lesson|resource/.test(normalized)) {
    answer =
      "To upload materials, open the Courses area, choose the course, and use the Upload Resource action in the Module planner. I recommend adding a short summary and release date so learners get the right nudge.";
  } else if (/progress|status|completion|report/.test(normalized)) {
    answer =
      "You can review learner progress from the dashboard overview or by visiting the analytics tab inside each course. The assistant can summarize the top blockers or export a CSV if you need to share it.";
  } else if (/office hour|schedule|calendar|meeting/.test(normalized)) {
    answer =
      "Scheduling works best from the Scheduler view. Add your office hours block, then select the cohort so invitations are sent automatically. I can also draft a reminder email if helpful.";
  } else if (/announcement|message|communication/.test(normalized)) {
    answer =
      "Draft announcements directly in the Courses area or ask me to create a template. Once ready, publish it with a send window so learners receive it at the ideal time.";
  } else if (/support|trouble|issue|ticket/.test(normalized)) {
    answer =
      "If something feels off, the Support workspace has guided troubleshooting and a quick ticket form. Meanwhile, describe the issue and I can walk you through immediate fixes.";
  } else if (isInScopeQuestion(question)) {
    answer =
      "Here's what I can help with: navigating between dashboards, preparing cohorts, summarizing analytics, or answering general LMS questions. Let me know what you'd like to accomplish and I'll walk you through it.";
  } else {
    isOutOfScope = true;
    try {
      const completion = await openrouter.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant in a Learning Management System (LMS) called Luma Learn. While your primary purpose is to help with LMS-related tasks, you can answer general questions too. Keep responses concise and friendly.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      answer = completion.choices[0]?.message?.content || "I'm not sure how to help with that. Could you try rephrasing your question?";
    } catch {
      answer =
        "I apologize, but I'm having trouble processing your question right now. Please try asking something related to the LMS, or try again later.";
    }
  }

  const intent = detectNavigationIntent(question);

  return {
    answer,
    intent,
    isOutOfScope,
  };
}

function chunkAnswer(answer: string): string[] {
  const tokens = answer.split(/(\s+)/);
  const chunks: string[] = [];
  let buffer = "";

  for (const token of tokens) {
    if (buffer.length + token.length > 32) {
      chunks.push(buffer);
      buffer = token;
    } else {
      buffer += token;
    }
  }

  if (buffer.trim()) {
    chunks.push(buffer);
  }

  return chunks;
}

export async function POST(request: Request) {
  let payload: ChatPayload;

  try {
    payload = (await request.json()) as ChatPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!payload.messages?.length) {
    return NextResponse.json(
      { error: "No messages provided" },
      { status: 400 }
    );
  }

  const lastMessage = [...payload.messages].reverse().find((message) => message.role === "user");

  if (!lastMessage) {
    return NextResponse.json(
      { error: "No user message found" },
      { status: 400 }
    );
  }

  const { answer, intent } = await buildAssistantResponse(lastMessage.content, payload.context);
  const chunks = chunkAnswer(answer);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let delay = 0;

      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      for (const chunk of chunks) {
        delay += 60;
        setTimeout(() => {
          send({ type: "token", value: chunk });
        }, delay);
      }

      delay += 180;
      setTimeout(() => {
        if (intent) {
          send({ type: "intent", intent });
        }
        send({ type: "final" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }, delay);
    },
    cancel() {
      // no-op; stream will simply close
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
