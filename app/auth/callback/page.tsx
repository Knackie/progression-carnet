'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseOAuth } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      // The client reads the tokens Google/Supabase put in the URL hash
      const { data, error } = await supabaseOAuth().auth.getSession();
      if (error || !data.session) {
        setError(error?.message ?? 'Connexion Google impossible');
        return;
      }
      localStorage.setItem('sb-session', JSON.stringify(data.session));
      localStorage.setItem('sb-user', JSON.stringify(data.session.user));
      window.location.replace('/dashboard');
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
        {error ? (
          <>
            <p className="text-red-600 mb-4">⚠️ {error}</p>
            <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
              Retour à la connexion
            </Link>
          </>
        ) : (
          <p className="text-gray-700">Connexion en cours…</p>
        )}
      </div>
    </main>
  );
}
