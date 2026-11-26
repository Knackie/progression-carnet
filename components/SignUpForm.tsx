'use client';

import { useState } from 'react';
import Link from 'next/link';
import GoogleButton from '@/components/GoogleButton';

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
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-5">
        <div className="flex gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Inscription réussie !</p>
            <p className="text-green-700 text-sm mt-1">Vérifiez votre email pour confirmer votre compte et vous connecter.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
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
          placeholder="Minimum 8 caractères"
          required
          minLength={8}
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères recommandés</p>
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
            Inscription en cours...
          </span>
        ) : (
          "S'inscrire"
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

      <GoogleButton label="S'inscrire avec Google" />

      <p className="text-center text-sm text-gray-600">
        Consultez notre{' '}
        <Link href="/confidentialite" className="text-blue-600 hover:underline">
          politique de confidentialité
        </Link>.
      </p>

      {/* Login Link */}
      <p className="text-center text-gray-700">
        Vous avez déjà un compte ?{' '}
        <Link
          href="/auth/login"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
