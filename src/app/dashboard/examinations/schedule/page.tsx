import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function ExamSchedulePage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Calendar className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Exam Schedule
        </h1>
        <p className="text-muted-foreground max-w-md">
          This section will display the schedule for upcoming and past examinations.
        </p>
      </div>
    </div>
  );
}
