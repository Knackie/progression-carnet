'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('SignUp failed:', data);
        setError(data.error || 'Une erreur est survenue');
        setLoading(false);
      } else {
        console.log('SignUp success:', data);
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('SignUp exception:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-green-800">
        <p>Inscriptions réussies ! Vérifiez votre email pour confirmer votre compte.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
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
        {loading ? 'Inscription...' : "S'inscrire"}
      </button>

      <p className="text-center text-sm">
        Vous avez déjà un compte ?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
