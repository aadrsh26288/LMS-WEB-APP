import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Manage curriculum, modules, and learner-facing resources in one place.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fundamentals of Design</CardTitle>
            <CardDescription>Next cohort launches Oct 28</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            12 modules • 132 enrolled learners • Last updated 3 days ago.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Analytics Deep-Dive</CardTitle>
            <CardDescription>Recommended for data-centric cohorts</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            8 modules • 64 enrolled learners • Draft status.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
