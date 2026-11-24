'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('SignIn failed:', data);
        setError(data.error || 'Une erreur est survenue');
        setLoading(false);
      } else {
        console.log('SignIn success:', data);
        
        // Store session data in localStorage
        if (data.data?.session) {
          try {
            const sessionStr = JSON.stringify(data.data.session);
            const userStr = JSON.stringify(data.data.user);
            
            localStorage.setItem('sb-session', sessionStr);
            localStorage.setItem('sb-user', userStr);
            
            console.log('Session stored in localStorage');
            console.log('sb-session:', localStorage.getItem('sb-session') ? 'stored' : 'not found');
            console.log('sb-user:', localStorage.getItem('sb-user') ? 'stored' : 'not found');
            
            // Small delay to ensure localStorage is fully synced
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Navigate to dashboard using router.push
            router.push('/dashboard');
          } catch (storageError) {
            console.error('Failed to store session:', storageError);
            setError('Erreur de stockage local');
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.error('SignIn exception:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-red-800">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-center text-sm">
        Pas encore de compte ?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          S'inscrire
        </Link>
      </p>
    </form>
  );
}


