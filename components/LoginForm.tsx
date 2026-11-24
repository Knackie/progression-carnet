'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmail } from '@/app/auth/actions';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmail(email, password);

      if (result.error) {
        console.error('SignIn failed:', result.error);
        setError(result.error);
        setLoading(false);
      } else {
        console.log('SignIn success');
        
        // Store session data in localStorage
        if (result.session) {
          try {
            localStorage.setItem('sb-session', JSON.stringify(result.session));
            localStorage.setItem('sb-user', JSON.stringify(result.user));
            
            console.log('Session and user stored in localStorage');
            
            // Use window.location.href for hard redirect - avoids Next.js RSC issues
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 50);
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


