'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (isSignedIn) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isSignedIn, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
