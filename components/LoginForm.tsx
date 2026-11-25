'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmail } from '@/app/auth/actions';
import GoogleButton from '@/components/GoogleButton';

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
        
        if (result.session) {
          try {
            localStorage.setItem('sb-session', JSON.stringify(result.session));
            localStorage.setItem('sb-user', JSON.stringify(result.user));
            
            console.log('Session and user stored in localStorage');
            
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
    <form onSubmit={handleSignIn} className="space-y-5">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Adresse email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition"
          placeholder="votre@email.com"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition"
          placeholder="••••••••"
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⌛</span>
            Connexion en cours...
          </span>
        ) : (
          'Se connecter'
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou</span>
        </div>
      </div>

      <GoogleButton />

      {/* Sign Up Link */}
      <p className="text-center text-gray-700">
        Pas encore de compte ?{' '}
        <Link
          href="/auth/signup"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          S'inscrire
        </Link>
      </p>
    </form>
  );
}


