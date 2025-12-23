import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

export default function MarksEntryPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Edit className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Marks Entry
        </h1>
        <p className="text-muted-foreground max-w-md">
          This section will be used by teachers to enter student marks for various exams.
        </p>
      </div>
    </div>
  );
}
