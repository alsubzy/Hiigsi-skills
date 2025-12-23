import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function CommunicationPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Megaphone className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Communication System
        </h1>
        <p className="text-muted-foreground max-w-md">
          This area will be for announcements, notifications, and parent-teacher communication. Features will include in-app messaging and email integration.
        </p>
      </div>
    </div>
  );
}
