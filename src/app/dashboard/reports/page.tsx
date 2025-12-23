import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileOutput } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <FileOutput className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground max-w-md">
          This is where you will find system reports, create custom reports, and export data in formats like PDF, Excel, and CSV. Features will include academic reports, financial statements, and attendance records.
        </p>
      </div>
    </div>
  );
}
