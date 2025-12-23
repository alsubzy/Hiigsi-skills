import {
    Card,
  } from '@/components/ui/card';
  import { GraduationCap } from 'lucide-react';
  
  export default function StudentsPage() {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-2 text-center">
              <GraduationCap className="h-16 w-16 text-muted-foreground" />
              <h1 className="text-2xl font-bold tracking-tight">
                  Student Management
              </h1>
              <p className="text-muted-foreground max-w-md">
                  Manage student profiles, admissions, attendance, and promotions from this section.
              </p>
          </div>
      </div>
    );
  }
  