'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const session = localStorage.getItem('sb-session');
    const user = localStorage.getItem('sb-user');
    
    console.log('Dashboard checking auth...');
    console.log('Session found:', !!session);
    console.log('User found:', !!user);

    if (!session || !user) {
      console.log('No session/user found, redirecting to login');
      setIsLoading(false);
      // Use setTimeout to ensure redirect happens after component mounts
      setTimeout(() => {
        router.push('/auth/login');
      }, 100);
      return;
    }

    setHasSession(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!hasSession) {
    return <div className="min-h-screen flex items-center justify-center">Redirection...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold">🎉 Bienvenue au Dashboard!</h1>
      <p className="mt-4 text-gray-600">Vous êtes connecté avec succès.</p>
      <button
        onClick={() => {
          localStorage.removeItem('sb-session');
          localStorage.removeItem('sb-user');
          router.push('/auth/login');
        }}
        className="mt-8 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Déconnexion
      </button>
    </main>
  );
}
