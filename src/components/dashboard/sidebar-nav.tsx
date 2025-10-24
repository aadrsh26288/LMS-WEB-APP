'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Chat Assistant",
    href: "/dashboard/chat",
    icon: MessageSquare,
    badge: "New",
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    label: "Scheduler",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] flex-col border-r bg-background p-6 lg:flex">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
          LL
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold leading-none">Luma Learn</p>
          <p className="text-xs text-muted-foreground">Instructor workspace</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group flex w-full items-center justify-between gap-2 px-3",
                "transition-colors",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge ? (
                <Badge variant="secondary" className="text-[10px]">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Assistant tips</p>
        <p className="mt-2 leading-relaxed">
          Mention a page or task and the assistant can open it for you, summarize
          course analytics, or draft learner messages.
        </p>
      </div>
    </aside>
  );
}
