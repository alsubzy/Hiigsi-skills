'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // UNIVERSAL ADMIN ACCESS: Redirect all authenticated users to the Admin Workspace
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
