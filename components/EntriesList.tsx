'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: string;
  sport: 'badminton' | 'chess';
  entry_type: 'match' | 'training';
  date: string;
  score?: number;
  notes: string;
  strengths: string[];
  weaknesses: string[];
  improvement_axes: string[];
}

export default function EntriesList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    loadEntries();
  }, [isHydrated]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError('');

      // Get session from localStorage
      const sessionStr = localStorage.getItem('sb-session');
      const userStr = localStorage.getItem('sb-user');

      if (!sessionStr || !userStr) {
        setError('Session non trouvée - veuillez vous reconnecter');
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionStr);
      const user = JSON.parse(userStr);

      if (!session.access_token) {
        setError('Token d\'accès invalide');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/entries', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      const data = await response.json();
      setEntries(data.data || []);
    } catch (err) {
      console.error('Load entries error:', err);
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="inline-block animate-spin text-3xl mb-3">⌛</div>
          <p className="text-gray-600">Chargement des entrées...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold">❌ {error}</p>
          <button
            onClick={loadEntries}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-600 text-lg font-semibold">Aucune entrée pour le moment</p>
          <p className="text-gray-500 text-sm mt-2">Créez votre première entrée en cliquant sur le bouton ci-dessus!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">📋 Vos Entrées Récentes ({entries.length})</h3>
      <div className="grid gap-4">
        {entries.slice(0, 10).map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-blue-500"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {entry.sport === 'badminton' ? '🏸' : '♟️'}
                  </span>
                  <span className="text-xl font-bold text-gray-800">
                    {entry.sport === 'badminton' ? 'Badminton' : 'Échecs'}
                  </span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {entry.entry_type === 'match' ? '🎯 Match' : '🏋️ Entraînement'}
                  </span>
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
              {entry.score !== undefined && (
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-3xl font-black text-blue-600">{entry.score}</div>
                  <div className="text-xs text-gray-600">/10</div>
                </div>
              )}
            </div>

            {/* Notes */}
            {entry.notes && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">📝 Impressions</p>
                <p className="text-gray-700">{entry.notes}</p>
              </div>
            )}

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              {entry.strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">💪 Points Forts</p>
                  <ul className="space-y-1">
                    {entry.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-green-700">✓ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {entry.weaknesses.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Points Faibles</p>
                  <ul className="space-y-1">
                    {entry.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-red-700">✗ {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Axes */}
              {entry.improvement_axes.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-2">🎯 Axes de Progression</p>
                  <ul className="space-y-1">
                    {entry.improvement_axes.map((a, i) => (
                      <li key={i} className="text-sm text-purple-700">→ {a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
