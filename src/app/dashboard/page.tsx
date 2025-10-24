import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverviewPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Here&apos;s a snapshot of this week&apos;s progress.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Active learners</p>
              <p className="text-2xl font-semibold text-foreground">148</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              +6% vs last week
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Assignments graded</p>
              <p className="text-2xl font-semibold text-foreground">72</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Right on track
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-dashed bg-muted/40">
        <CardHeader>
          <CardTitle>Need a hand?</CardTitle>
          <CardDescription>
            Use the chat assistant to jump to workflows, draft communications, or get guidance across the LMS.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
