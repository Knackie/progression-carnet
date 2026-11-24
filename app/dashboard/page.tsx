'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuickEntryForm from '@/components/QuickEntryForm';
import EntriesList from '@/components/EntriesList';
import ProgressionGraph from '@/components/ProgressionGraph';
import PlayerProfile from '@/components/PlayerProfile';
import { getOrRefreshSession } from '@/app/auth/actions';
import { useTheme } from '@/lib/ThemeContext';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // First, try to get session from server (checks cookies)
      const serverResult = await getOrRefreshSession();

      if (serverResult.session && serverResult.user) {
        // Session is valid from cookies, update localStorage
        localStorage.setItem('sb-session', JSON.stringify(serverResult.session));
        localStorage.setItem('sb-user', JSON.stringify(serverResult.user));
        setUserEmail(serverResult.user.email || '');
        setHasSession(true);
        setSessionExpired(false);
        setIsLoading(false);
        return;
      }

      // If no server session, try localStorage
      const sessionStr = localStorage.getItem('sb-session');
      const userStr = localStorage.getItem('sb-user');

      if (!sessionStr || !userStr) {
        setIsLoading(false);
        setTimeout(() => {
          router.push('/auth/login');
        }, 100);
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        setUserEmail(userData.email);
        setHasSession(true);
        setSessionExpired(false);
      } catch (e) {
        console.error('Failed to parse user:', e);
        setSessionExpired(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sb-session');
    localStorage.removeItem('sb-user');
    router.push('/auth/login');
  };

  const handleEntryCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('quick-entry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <div className="text-center">
          <div className="inline-block animate-spin text-5xl">🏸</div>
          <p className="text-white mt-4 text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <p className="text-white">Redirection...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏸</div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Carnet de Progression
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition transform hover:scale-105"
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link href="/info" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition">
                À Propos
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition transform hover:scale-105 active:scale-95"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Session Expired Banner */}
      {sessionExpired && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b-2 border-yellow-400 dark:border-yellow-600 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold">Votre session a expiré. Veuillez vous reconnecter.</p>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-yellow-700 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-800 dark:hover:bg-yellow-700 font-semibold"
            >
              Se reconnecter
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards with Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button onClick={scrollToForm} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-purple-900/30 transition hover:scale-105 transform cursor-pointer text-left dark:border dark:border-gray-700">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Ajouter une Entrée</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">Rapide</p>
          </button>

          <Link href="/dashboard/analysis" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-purple-900/30 transition hover:scale-105 transform cursor-pointer dark:border dark:border-gray-700">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Analyse Structurée</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">Guidée</p>
          </Link>

          <Link href="/dashboard/analysis#progression" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-purple-900/30 transition hover:scale-105 transform cursor-pointer dark:border dark:border-gray-700">
            <div className="text-5xl mb-3">📈</div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Progression</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">Visible</p>
          </Link>

          <button onClick={() => document.getElementById('player-profile')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-purple-900/30 transition hover:scale-105 transform cursor-pointer text-left dark:border dark:border-gray-700">
            <div className="text-5xl mb-3">👤</div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Profil Joueur</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">Complet</p>
          </button>
        </div>

        {/* Progression Graph */}
        <div className="mb-12">
          <ProgressionGraph />
        </div>

        {/* Player Profile */}
        <div className="mb-12" id="player-profile">
          <PlayerProfile />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <QuickEntryForm onEntryCreated={handleEntryCreated} />
          </div>

          {/* Right Column - Entries List */}
          <div className="lg:col-span-2">
            <EntriesList key={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  );
}
