import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Coins } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Coins className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">
          Finance & Fees Management
        </h1>
        <p className="text-muted-foreground max-w-md">
          Manage fee structures, student payments, invoices, and generate financial reports from this section.
        </p>
      </div>
    </div>
  );
}
