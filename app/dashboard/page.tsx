'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuickEntryForm, { EntryPrefill } from '@/components/QuickEntryForm';
import EntriesList from '@/components/EntriesList';
import ProgressionGraph from '@/components/ProgressionGraph';
import { useTheme } from '@/lib/ThemeContext';
import Logo from '@/components/Logo';
import PrepareMatchModal from '@/components/PrepareMatchModal';
import GoalCard from '@/components/GoalCard';
import InstallButton from '@/components/InstallButton';

const tileClass =
  'bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-3 sm:p-4 hover:shadow-xl transition flex flex-col items-center text-center gap-1 dark:border dark:border-gray-700';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const [prefill, setPrefill] = useState<EntryPrefill | null>(null);

  // Coming from the points calculator: /dashboard?result=win&points=32&note=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    if (result !== 'win' && result !== 'loss' && result !== 'draw') return;
    const points = Number(params.get('points'));
    const chess = params.get('sport') === 'chess';
    setPrefill({
      sport: chess ? 'chess' : 'badminton',
      matchResult: result,
      pointsDelta: !chess && params.get('points') !== null && Number.isFinite(points) ? points : undefined,
      notes: params.get('note') ?? undefined,
    });
    window.history.replaceState(null, '', '/dashboard');
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [router]);

  const checkAuth = () => {
    try {
      const sessionStr = localStorage.getItem('sb-session');
      const userStr = localStorage.getItem('sb-user');

      if (!sessionStr || !userStr) {
        router.replace('/auth/login');
        return;
      }

      const userData = JSON.parse(userStr);
      setUserEmail(userData.email);
      setHasSession(true);
      setSessionExpired(false);
    } catch (err) {
      console.error('Auth check error:', err);
      setSessionExpired(true);
    } finally {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex justify-between items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Logo size={40} showText={false} />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                  <span className="sm:hidden">Carnet</span>
                  <span className="hidden sm:inline">Carnet de Progression</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{userEmail}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <InstallButton />
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link href="/info" className="hidden sm:block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition">
                À Propos
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition active:scale-95"
                title="Déconnexion"
              >
                <span className="sm:hidden">⏻</span>
                <span className="hidden sm:inline">Déconnexion</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Main action first, then shortcuts */}
        <div className="space-y-3 mb-8 sm:mb-12">
          <QuickEntryForm key={prefill ? 'prefilled' : 'empty'} prefill={prefill} onEntryCreated={handleEntryCreated} />

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button onClick={() => setPreparing(true)} className={tileClass}>
              <span className="text-2xl sm:text-3xl">📋</span>
              <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Préparer</span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">un match à venir</span>
            </button>
            <Link href="/dashboard/calculator" className={tileClass}>
              <span className="text-2xl sm:text-3xl">🧮</span>
              <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Calcul</span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">points FFBaD · Elo</span>
            </Link>
            <Link href="/dashboard/analysis" className={tileClass}>
              <span className="text-2xl sm:text-3xl">📊</span>
              <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Analyse</span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Points récurrents</span>
            </Link>
            <Link href="/profile" className={tileClass}>
              <span className="text-2xl sm:text-3xl">👤</span>
              <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Profil</span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Classement, objectif</span>
            </Link>
          </div>
        </div>

        {preparing && <PrepareMatchModal onClose={() => setPreparing(false)} onCreated={handleEntryCreated} />}

        <div className="mb-8">
          <GoalCard key={refreshTrigger} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <ProgressionGraph key={refreshTrigger} />
          </div>
          <div className="lg:col-span-3">
            <EntriesList key={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  );
}
