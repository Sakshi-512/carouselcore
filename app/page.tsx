'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check auth state and redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Logged in → Dashboard
        router.push('/dashboard');
      } else {
        // Not logged in → Landing
        router.push('/landing');
      }
    });
  }, [router]);

  // Show loading while checking
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-slate-800 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}