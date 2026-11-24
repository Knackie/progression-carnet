'use client';

import Link from 'next/link';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header avec Menu */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
            📊 Carnet de Progression
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-semibold transition">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-purple-600 font-semibold transition">
              Profil
            </Link>
            <Link href="/info" className="text-purple-600 font-bold border-b-2 border-purple-600">
              À Propos
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">📊</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Carnet de Progression
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Suivez votre évolution au Badminton et aux Échecs
          </p>
          <p className="text-xl text-gray-600">
            Un outil simple et efficace pour tracker votre progression et analyser vos performances
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Notre Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Tracker la Progression</h3>
              <p className="text-blue-800">
                Enregistrez chaque match et entraînement pour voir votre évolution au fil du temps avec des graphiques détaillés.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Analyser les Données</h3>
              <p className="text-purple-800">
                Visualisez vos performances avec des graphiques intuitifs. Comprenez vos forces et faiblesses pour progresser plus vite.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 border-2 border-pink-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-pink-900 mb-4">Se Fixer des Objectifs</h3>
              <p className="text-pink-800">
                Définissez vos objectifs de saison et suivez votre progression vers vos buts. Restez motivé et focalisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Fonctionnalités Principales</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📋</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Enregistrement Facile</h3>
                  <p className="text-gray-700">
                    Ajoutez rapidement vos matchs et entraînements avec tous les détails pertinents: score, résultat, points forts, points faibles et axes de progression.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Graphiques en Temps Réel</h3>
                  <p className="text-gray-700">
                    Visualisez votre progression avec des graphiques interactifs. Regardez votre score moyen augmenter au fil des matchs.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-pink-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👤</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Profil Personnalisé</h3>
                  <p className="text-gray-700">
                    Créez votre profil joueur complet avec vos informations personnelles, votre style de jeu, vos objectifs et vos statistiques globales.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎮</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Support Multi-Sports</h3>
                  <p className="text-gray-700">
                    Suivez votre progression en Badminton ET en Échecs. Chaque sport a ses propres analyses et conseils adaptés.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔍</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Analyses Détaillées</h3>
                  <p className="text-gray-700">
                    Accédez à des analyses poussées de votre progression. Identifiez les tendances et les opportunités d'amélioration.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-indigo-600">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💾</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Données Sécurisées</h3>
                  <p className="text-gray-700">
                    Vos données sont stockées de manière sécurisée avec authentification. Accédez-y depuis n'importe où, à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crédits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-24 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">À Propos du Projet</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Timéo */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 backdrop-blur">
              <div className="text-center">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-bold mb-3">Timéo</h3>
                <p className="text-lg mb-2">Créateur de l'Idée</p>
                <p className="text-opacity-90">
                  C'est l'idée brillante de Timéo qui a inspiré ce projet. Il a envisagé un outil pour tracker la progression des joueurs et analyser leurs performances.
                </p>
              </div>
            </div>

            {/* Mathieu */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 backdrop-blur">
              <div className="text-center">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-2xl font-bold mb-3">Mathieu</h3>
                <p className="text-lg mb-2">Développeur</p>
                <p className="text-opacity-90">
                  Mathieu a transformé cette idée en réalité en développant une application web moderne, intuitive et performante avec toutes les fonctionnalités nécessaires.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-white border-opacity-20 pt-12">
            <p className="text-xl mb-6">
              Un merci spécial à Timéo pour son idée révolutionnaire et à Mathieu pour son dévouement dans la création de cette application.
            </p>
            <p className="text-opacity-75">
              © 2026 Carnet de Progression. Tous droits réservés.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Prêt à Commencer?</h2>
        <p className="text-xl text-gray-600 mb-8">
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
            className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl transition"
          >
            Aller au Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
