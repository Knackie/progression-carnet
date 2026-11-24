'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Entry {
  id: string;
  sport: 'badminton' | 'chess';
  entry_type: 'match' | 'training';
  date: string;
  score?: number;
  match_result?: 'win' | 'loss' | 'draw';
  strengths: string[];
  weaknesses: string[];
  improvement_axes: string[];
}

interface AnalysisData {
  totalEntries: number;
  avgScore: number;
  matchStats: {
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  };
  topStrengths: { label: string; count: number }[];
  topWeaknesses: { label: string; count: number }[];
  topAxes: { label: string; count: number }[];
  recentEntries: Entry[];
}

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const sessionStr = localStorage.getItem('sb-session');
    if (!sessionStr) {
      router.push('/auth/login');
      return;
    }

    loadAnalysis();
  }, [isHydrated, router]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError('');

      const sessionStr = localStorage.getItem('sb-session');
      if (!sessionStr) {
        throw new Error('Session non trouvée');
      }

      const session = JSON.parse(sessionStr);

      const response = await fetch('/api/entries', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      const entries: Entry[] = result.data || [];

      // Calculate analysis
      const totalEntries = entries.length;
      const scores = entries.filter((e) => e.score !== undefined).map((e) => e.score!);
      const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b) / scores.length) * 10) / 10 : 0;

      // Count frequencies
      const strengthsMap: { [key: string]: number } = {};
      const weaknessesMap: { [key: string]: number } = {};
      const axesMap: { [key: string]: number } = {};

      entries.forEach((entry) => {
        entry.strengths?.forEach((s) => {
          if (s.trim()) strengthsMap[s] = (strengthsMap[s] || 0) + 1;
        });
        entry.weaknesses?.forEach((w) => {
          if (w.trim()) weaknessesMap[w] = (weaknessesMap[w] || 0) + 1;
        });
        entry.improvement_axes?.forEach((a) => {
          if (a.trim()) axesMap[a] = (axesMap[a] || 0) + 1;
        });
      });

      const topStrengths = Object.entries(strengthsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }));

      const topWeaknesses = Object.entries(weaknessesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }));

      const topAxes = Object.entries(axesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }));

      // Calculate match statistics
      const matches = entries.filter((e) => e.entry_type === 'match');
      const wins = matches.filter((e) => e.match_result === 'win').length;
      const losses = matches.filter((e) => e.match_result === 'loss').length;
      const draws = matches.filter((e) => e.match_result === 'draw').length;
      const winRate = matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0;

      setAnalysis({
        totalEntries,
        avgScore,
        matchStats: {
          totalMatches: matches.length,
          wins,
          losses,
          draws,
          winRate,
        },
        topStrengths,
        topWeaknesses,
        topAxes,
        recentEntries: entries.slice(0, 10),
      });
    } catch (err) {
      console.error('Load analysis error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="text-center">
          <div className="inline-block animate-spin text-5xl mb-3">⌛</div>
          <p className="text-gray-600">Chargement de votre analyse...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold mb-6 inline-block">
          ← Retour au tableau de bord
        </Link>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-red-600 font-semibold">❌ {error || 'Erreur lors du chargement'}</p>
          <button
            onClick={loadAnalysis}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mt-4">📊 Votre Analyse de Progression</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-600 font-semibold">Total d'entrées</p>
          <p className="text-5xl font-bold text-blue-600">{analysis.totalEntries}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-gray-600 font-semibold">Score moyen</p>
          <p className="text-5xl font-bold text-purple-600">{analysis.avgScore}/10</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-gray-600 font-semibold">Taux de victoire</p>
          <p className="text-5xl font-bold text-green-600">{analysis.matchStats.winRate}%</p>
          <p className="text-sm text-gray-500 mt-2">({analysis.matchStats.wins}W/{analysis.matchStats.losses}L/{analysis.matchStats.draws}D)</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-600 font-semibold">Axes de progression</p>
          <p className="text-5xl font-bold text-orange-600">{analysis.topAxes.length}</p>
        </div>
      </div>

      {/* Three Columns Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-4">💪 Points Forts Récurrents</h2>
          {analysis.topStrengths.length > 0 ? (
            <div className="space-y-3">
              {analysis.topStrengths.map((item, i) => (
                <div
                  key={i}
                  className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-green-800 font-semibold flex-1">{item.label}</p>
                    <span className="text-green-600 font-bold text-lg ml-2">{item.count}x</span>
                  </div>
                  <div className="mt-2 bg-green-200 rounded-full h-2 w-full overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all"
                      style={{ width: `${(item.count / analysis.totalEntries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Pas de points forts enregistrés</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-700 mb-4">⚠️ Points Faibles Récurrents</h2>
          {analysis.topWeaknesses.length > 0 ? (
            <div className="space-y-3">
              {analysis.topWeaknesses.map((item, i) => (
                <div
                  key={i}
                  className="bg-red-50 rounded-lg p-4 border border-red-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-red-800 font-semibold flex-1">{item.label}</p>
                    <span className="text-red-600 font-bold text-lg ml-2">{item.count}x</span>
                  </div>
                  <div className="mt-2 bg-red-200 rounded-full h-2 w-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all"
                      style={{ width: `${(item.count / analysis.totalEntries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Pas de points faibles enregistrés</p>
          )}
        </div>

        {/* Improvement Axes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">🎯 Axes de Progression Prioritaires</h2>
          {analysis.topAxes.length > 0 ? (
            <div className="space-y-3">
              {analysis.topAxes.map((item, i) => (
                <div
                  key={i}
                  className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-purple-800 font-semibold flex-1">{item.label}</p>
                    <span className="text-purple-600 font-bold text-lg ml-2">{item.count}x</span>
                  </div>
                  <div className="mt-2 bg-purple-200 rounded-full h-2 w-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full transition-all"
                      style={{ width: `${(item.count / analysis.totalEntries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Pas d'axes enregistrés</p>
          )}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Dernières Entrées</h2>
        <div className="space-y-4">
          {analysis.recentEntries.length > 0 ? (
            analysis.recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-2xl mr-2">{entry.sport === 'badminton' ? '🏸' : '♟️'}</span>
                    <span className="font-bold text-gray-800">{entry.sport === 'badminton' ? 'Badminton' : 'Échecs'}</span>
                    <span className="ml-2 text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {entry.entry_type === 'match' ? '🎯 Match' : '🏋️ Entraînement'}
                    </span>
                  </div>
                  {entry.score !== undefined && (
                    <span className="text-lg font-bold text-blue-600">{entry.score}/10</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  📅 {new Date(entry.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune entrée</p>
          )}
        </div>
      </div>
    </div>
  );
}
