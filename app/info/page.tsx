'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useTheme } from '@/lib/ThemeContext';

export default function InfoPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 transition-colors">
      {/* Header avec Menu */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/50 border-b dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-2">
          <Link href="/" aria-label="Accueil" className="hover:opacity-80 transition shrink-0">
            <span className="md:hidden"><Logo size={36} showText={false} /></span>
            <span className="hidden md:block text-2xl"><Logo size={36} /></span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition">
              Profil
            </Link>
            <Link href="/info" className="hidden sm:inline text-purple-600 dark:text-purple-400 font-bold border-b-2 border-purple-600 dark:border-purple-400">
              À Propos
            </Link>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6"><Logo size={96} showText={false} /></div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Carnet de Progression
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Suivez votre évolution au Badminton et aux Échecs
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Un outil simple et efficace pour tracker votre progression et analyser vos performances
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white dark:bg-gray-900 py-16 border-y dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Notre Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg dark:hover:shadow-blue-900/30 transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">Tracker la Progression</h3>
              <p className="text-blue-800 dark:text-blue-300">
                Enregistrez chaque match et entraînement pour voir votre évolution au fil du temps avec des graphiques détaillés.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg dark:hover:shadow-purple-900/30 transition">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-4">Analyser les Données</h3>
              <p className="text-purple-800 dark:text-purple-300">
                Visualisez vos performances avec des graphiques intuitifs. Comprenez vos forces et faiblesses pour progresser plus vite.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 rounded-2xl p-8 border-2 border-pink-200 dark:border-pink-800 hover:shadow-lg dark:hover:shadow-pink-900/30 transition">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-pink-900 dark:text-pink-200 mb-4">Se Fixer des Objectifs</h3>
              <p className="text-pink-800 dark:text-pink-300">
                Définissez vos objectifs de saison et suivez votre progression vers vos buts. Restez motivé et focalisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Fonctionnalités Principales</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-blue-600 dark:border-blue-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📋</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Enregistrement Facile</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ajoutez rapidement vos matchs et entraînements avec tous les détails pertinents: score, résultat, points forts, points faibles et axes de progression.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-purple-600 dark:border-purple-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Graphiques en Temps Réel</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Visualisez votre progression avec des graphiques interactifs. Regardez votre score moyen augmenter au fil des matchs.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-pink-600 dark:border-pink-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👤</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Profil Personnalisé</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Créez votre profil joueur complet avec vos informations personnelles, votre style de jeu, vos objectifs et vos statistiques globales.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-green-600 dark:border-green-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎮</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Support Multi-Sports</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Suivez votre progression en Badminton ET en Échecs. Chaque sport a ses propres analyses et conseils adaptés.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-orange-600 dark:border-orange-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔍</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Analyses Détaillées</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Accédez à des analyses poussées de votre progression. Identifiez les tendances et les opportunités d'amélioration.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 border-l-4 border-indigo-600 dark:border-indigo-500">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💾</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Données Sécurisées</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Vos données sont stockées de manière sécurisée avec authentification. Accédez-y depuis n'importe où, à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crédits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900/80 dark:to-purple-900/80 py-16 md:py-24 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">À Propos du Projet</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Timéo */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-2xl p-8 border-2 border-blue-300 dark:border-blue-700">
              <div className="text-center">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">Timéo</h3>
                <p className="text-lg text-blue-800 dark:text-blue-200 font-semibold mb-2">Créateur de l'Idée</p>
                <p className="text-blue-700 dark:text-blue-300">
                  C'est l'idée brillante de Timéo qui a inspiré ce projet. Il a envisagé un outil pour tracker la progression des joueurs et analyser leurs performances.
                </p>
              </div>
            </div>

            {/* Mathieu */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-2xl p-8 border-2 border-purple-300 dark:border-purple-700">
              <div className="text-center">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">Mathieu</h3>
                <p className="text-lg text-purple-800 dark:text-purple-200 font-semibold mb-2">Développeur</p>
                <p className="text-purple-700 dark:text-purple-300">
                  Mathieu a transformé cette idée en réalité en développant une application web moderne, intuitive et performante avec toutes les fonctionnalités nécessaires.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center border-t-2 border-purple-300 dark:border-purple-700 pt-12">
            <p className="text-xl text-white mb-6">
              Un merci spécial à Timéo pour son idée révolutionnaire et à Mathieu pour son dévouement dans la création de cette application.
            </p>
            <p className="text-white/80">
              © 2026 Carnet de Progression. Tous droits réservés.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Prêt à Commencer?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Rejoignez-nous et commencez à tracker votre progression dès aujourd'hui!
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105"
          >
            Créer un Compte
          </Link>
          <Link
            href="/dashboard"
            className="bg-white dark:bg-gray-700 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-600 font-bold py-4 px-8 rounded-xl transition"
          >
            Aller au Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
