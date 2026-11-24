'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Carnet de Progression 🏸</h1>
          <p className="text-xl text-gray-700 mb-8">Analysez votre progression et devenez meilleur</p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Aller au dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Carnet de Progression 🏸</h1>
          <p className="text-xl text-gray-700 mb-8">Analysez votre progression au badminton et aux échecs</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              S'inscrire
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-blue-600 px-8 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-4">Journal personnel</h2>
            <p className="text-gray-700">Notez vos impressions, ressentis et ce que vous souhaitez après chaque match ou entraînement.</p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-4">Analyse structurée</h2>
            <p className="text-gray-700">Identifiez vos points forts, points faibles, erreurs et définissez vos axes de progression.</p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-4">Visualisez votre progression</h2>
            <p className="text-gray-700">Suivez votre évolution avec des graphiques détaillés par mois et par sport.</p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Sports supportés</h2>
            <p className="text-gray-700">Badminton, échecs, et prochainement tennis et tennis de table.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
