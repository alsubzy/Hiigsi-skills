'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <GraduationCap className="h-24 w-24 text-primary" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Your School Management System
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Everything you need to manage your institution is right here. Select a module from the sidebar to get started.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/students">Manage Students</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/finance">View Finances</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
