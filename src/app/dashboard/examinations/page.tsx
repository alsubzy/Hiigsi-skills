import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ExaminationsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Examination & Results
        </h1>
        <p className="text-muted-foreground max-w-md">
          Manage all exam-related activities including schedules, marks entry, and report card generation.
        </p>
      </div>
    </div>
  );
}
