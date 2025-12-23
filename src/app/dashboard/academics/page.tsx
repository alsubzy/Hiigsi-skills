import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function AcademicsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Academic Management
        </h1>
        <p className="text-muted-foreground max-w-md">
          This section will house all academic management features, including classes, sections, subjects, teacher assignments, timetables, syllabus, and more.
        </p>
      </div>
    </div>
  );
}
