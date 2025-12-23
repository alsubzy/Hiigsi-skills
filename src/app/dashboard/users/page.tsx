import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Users } from 'lucide-react';
  
  export default function UsersPage() {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-2 text-center">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold tracking-tight">
                    User Management
                </h1>
                <p className="text-muted-foreground max-w-md">
                    Here you can manage all users including staff, parents, and students. You can also handle roles, permissions, and view activity logs.
                </p>
            </div>
        </div>
    );
  }
  