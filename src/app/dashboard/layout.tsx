import type { ReactNode } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/dashboard/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="text-sm text-muted-foreground">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Command center
              </p>
              <p className="text-base font-semibold text-foreground">
                Your learning assistant
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                View guides
              </Button>
              <Link
                href="/dashboard/chat"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Ask the assistant
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
              </Button>
              <Avatar>
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <Separator className="bg-border/60" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
