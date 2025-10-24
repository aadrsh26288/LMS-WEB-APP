import type { NavigationIntent } from "./types";

interface IntentConfig {
  keywords: string[];
  intent: NavigationIntent;
}

const intentConfigurations: IntentConfig[] = [
  {
    keywords: ["course", "curriculum", "modules"],
    intent: {
      href: "/dashboard/courses",
      label: "Open Courses",
      mode: "link",
      description: "Jump straight into course management to adjust modules or upload content.",
    },
  },
  {
    keywords: ["schedule", "calendar", "office hours", "session"],
    intent: {
      href: "/dashboard/calendar",
      label: "View scheduler",
      mode: "link",
      description: "Review upcoming sessions and adjust office hours in the scheduler view.",
    },
  },
  {
    keywords: ["support", "help", "ticket"],
    intent: {
      href: "/dashboard/support",
      label: "Visit support",
      mode: "link",
      description: "Access guides and submit a ticket without leaving the assistant.",
    },
  },
  {
    keywords: ["dashboard", "overview", "home"],
    intent: {
      href: "/dashboard",
      label: "Go to overview",
      mode: "link",
      description: "Return to the dashboard overview for a pulse on learner activity.",
    },
  },
  {
    keywords: ["chat", "assistant", "ask luma"],
    intent: {
      href: "/dashboard/chat",
      label: "Open chat",
      mode: "auto",
      description: "Opening the assistant workspace for deeper follow-up questions.",
    },
  },
];

export function detectNavigationIntent(message: string): NavigationIntent | null {
  const normalized = message.toLowerCase();

  for (const config of intentConfigurations) {
    if (config.keywords.some((keyword) => normalized.includes(keyword))) {
      return config.intent;
    }
  }

  return null;
}
