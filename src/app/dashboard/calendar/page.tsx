import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scheduler</h1>
        <p className="text-sm text-muted-foreground">
          Plan cohort sessions, office hours, and content launches.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
          <CardDescription>A quick glance at upcoming milestones.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-md bg-muted/60 px-4 py-3">
            <span>Mon 10:00 • Live session – Week 5</span>
            <span className="text-xs text-emerald-600">Ready</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/60 px-4 py-3">
            <span>Wed 14:00 • Office hours</span>
            <span className="text-xs text-blue-600">3 requests</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/60 px-4 py-3">
            <span>Fri 09:00 • Publish module 6</span>
            <span className="text-xs text-amber-600">Drafting</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
