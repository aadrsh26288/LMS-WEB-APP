import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
        <p className="text-sm text-muted-foreground">
          Find resources, submit tickets, or ask the assistant for immediate help.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Self-serve guides</CardTitle>
          <CardDescription>
            Popular documentation to keep you moving quickly.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>• Migrating cohort content between terms</p>
          <p>• Crafting nudges and reminder sequences</p>
          <p>• Troubleshooting learner login issues</p>
        </CardContent>
      </Card>
    </div>
  );
}
