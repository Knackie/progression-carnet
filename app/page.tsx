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
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <span className="text-2xl font-black text-white">Carnet de Progression</span>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/info"
              className="px-6 py-2 text-white font-semibold hover:bg-white/20 rounded-lg transition"
            >
              À Propos
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2 text-white font-semibold hover:bg-white/20 rounded-lg transition"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Dominez grâce à l'<span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">analyse</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Carnet de Progression est votre allié pour progresser au badminton et aux échecs en analysant chaque match et entraînement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 text-white font-bold transition transform hover:scale-105 active:scale-95 text-lg shadow-lg"
            >
              Commencer gratuitement ➜
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-white px-8 py-4 text-white font-bold hover:bg-white/10 transition text-lg"
            >
              Accédez à votre compte
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-3">Journal Libre</h3>
            <p className="text-blue-100">Notez vos impressions et ressentis après chaque match</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Analyse Guidée</h3>
            <p className="text-blue-100">Identifiez points forts, faiblesses et axes de progression</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">Statistiques</h3>
            <p className="text-blue-100">Suivez votre taux de victoire et vos tendances</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-3">Progression Visuelle</h3>
            <p className="text-blue-100">Graphiques détaillés pour voir votre évolution</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/30 mb-20">
          <h2 className="text-4xl font-black text-white mb-12 text-center">Comment ça fonctionne ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl font-black text-blue-300 mb-4">1️⃣</div>
              <h3 className="text-lg font-bold text-white mb-2">Enregistrez</h3>
              <p className="text-blue-100">Après chaque match ou entraînement, créez rapidement une entrée</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black text-blue-300 mb-4">2️⃣</div>
              <h3 className="text-lg font-bold text-white mb-2">Analysez</h3>
              <p className="text-blue-100">Remplissez la rubrique d'analyse avec vos observations</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black text-blue-300 mb-4">3️⃣</div>
              <h3 className="text-lg font-bold text-white mb-2">Progressez</h3>
              <p className="text-blue-100">Identifiez vos tendances et vos domaines à travailler</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black text-blue-300 mb-4">4️⃣</div>
              <h3 className="text-lg font-bold text-white mb-2">Dominez</h3>
              <p className="text-blue-100">Améliorez-vous grâce à une meilleure compréhension</p>
            </div>
          </div>
        </div>

        {/* Features Details */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-white mb-12 text-center">Fonctionnalités Principales</h2>
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 flex gap-6">
              <div className="text-5xl flex-shrink-0">👤</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Profil Joueur Personnalisé</h3>
                <p className="text-blue-100">Créez votre profil avec vos informations, style de jeu, objectifs de saison et vos points forts/faibles majeurs. Gardez une vision claire de vos aspirations.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 flex gap-6">
              <div className="text-5xl flex-shrink-0">🏆</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Classement et Résultats</h3>
                <p className="text-blue-100">Enregistrez le niveau de votre adversaire et le résultat de chaque match (victoire/défaite/nulle). Analysez votre performance selon la difficulté.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 flex gap-6">
              <div className="text-5xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Scoring Dynamique</h3>
                <p className="text-blue-100">Évaluez votre performance de 0 à 10 après chaque match. Visualisez votre courbe de progression au fil du temps.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 flex gap-6">
              <div className="text-5xl flex-shrink-0">📊</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyses Statistiques Complètes</h3>
                <p className="text-blue-100">Consultez vos points forts et faibles récurrents, vos axes de progression prioritaires. Identifiez les tendances pour maximiser votre développement.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 flex gap-6">
              <div className="text-5xl flex-shrink-0">🏸</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Multi-Sport</h3>
                <p className="text-blue-100">Suivez votre progression au badminton, aux échecs, et prochainement d'autres sports. Chaque sport a ses propres analyses et statistiques.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center border border-white/30">
          <h2 className="text-4xl font-black text-white mb-6">Prêt à progresser ?</h2>
          <p className="text-xl text-blue-50 mb-8">Rejoignez des centaines de joueurs qui améliorent leur jeu chaque jour</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 font-bold transition transform hover:scale-105 active:scale-95 text-lg"
            >
              Créer mon compte
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-white text-white hover:bg-white/20 px-8 py-4 font-bold transition text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/20 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-blue-100">
          <p className="mb-4">© 2026 Carnet de Progression. Tous droits réservés.</p>
          <p className="text-sm">Créé avec ❤️ pour les passionnés de badminton et d'échecs</p>
        </div>
      </footer>
    </main>
  );
}

