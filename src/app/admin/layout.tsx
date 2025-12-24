'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../dashboard/layout';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push('/sign-in'); // Redirect to sign-in if not authenticated at all
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <DashboardLayout>{children}</DashboardLayout>;
}
