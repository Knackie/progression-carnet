'use client';

import { useState, useEffect } from 'react';
import EditEntryModal from './EditEntryModal';
import { legacyLevelLabel } from '@/lib/rankings';
import { authFetch } from '@/lib/authFetch';
import { SetScore, formatSets } from '@/lib/badmintonScore';
import { EntryStatus, MatchGoal } from '@/lib/matchPrep';
import { formatPoints } from '@/lib/ffbadPoints';

const formatDate = (date: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR', opts);

function GoalsList({ goals }: { goals: MatchGoal[] }) {
  return (
    <ul className="space-y-1">
      {goals.map((g, i) => (
        <li key={i} className="text-sm text-gray-700 flex gap-2">
          <span>{g.achieved === true ? '✅' : g.achieved === false ? '❌' : '•'}</span>
          <span>{g.text}</span>
        </li>
      ))}
    </ul>
  );
}

interface Entry {
  id: string;
  sport: 'badminton' | 'chess';
  entry_type: 'match' | 'training';
  date: string;
  score?: number | null;
  opponent_level?: string | null;
  match_result?: 'win' | 'loss' | 'draw' | null;
  set_scores?: SetScore[] | null;
  status?: EntryStatus | null;
  opponent_name?: string | null;
  game_plan?: string | null;
  match_goals?: MatchGoal[] | null;
  points_delta?: number | null;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

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

      const response = await authFetch('/api/entries');

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

  // Phone: native share sheet (Instagram, WhatsApp…). Desktop: download.
  const handleExport = async (entry: Entry) => {
    try {
      setExportingId(entry.id);
      const response = await authFetch(`/api/entries/${entry.id}/card`);
      if (!response.ok) throw new Error("Impossible de générer l'image");
      const blob = await response.blob();
      const fileName = `carnet-${entry.sport}-${entry.date}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Carnet de Progression' });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Closing the share sheet is not an error
      if (err instanceof DOMException && err.name === 'AbortError') return;
      alert(err instanceof Error ? err.message : "Erreur lors de l'export");
    } finally {
      setExportingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await authFetch(`/api/entries/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setEntries(entries.filter(e => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
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

  const planned = entries
    .filter(e => e.status === 'planned')
    .sort((a, b) => a.date.localeCompare(b.date));
  const done = entries.filter(e => e.status !== 'planned');

  return (
    <div className="space-y-4">
      {planned.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">📋 Matchs à venir ({planned.length})</h3>
          {planned.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-5 border-l-4 border-indigo-500">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-800">
                    {entry.sport === 'badminton' ? '🏸' : '♟️'} {formatDate(entry.date)}
                  </p>
                  {(entry.opponent_name || entry.opponent_level) && (
                    <p className="text-sm text-gray-600">
                      vs {entry.opponent_name}{entry.opponent_name && entry.opponent_level ? ' · ' : ''}
                      {entry.opponent_level && legacyLevelLabel(entry.opponent_level)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 shrink-0"
                  title="Supprimer la préparation"
                >
                  {deletingId === entry.id ? '...' : '🗑️'}
                </button>
              </div>
              {entry.game_plan && (
                <p className="mt-3 text-sm text-gray-700 bg-indigo-50 rounded-lg p-3 whitespace-pre-line">🧠 {entry.game_plan}</p>
              )}
              {entry.match_goals && entry.match_goals.length > 0 && (
                <div className="mt-3">
                  <GoalsList goals={entry.match_goals} />
                </div>
              )}
              <button
                onClick={() => setEditingId(entry.id)}
                className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
              >
                ✅ Match joué : faire le bilan
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">📋 Vos Entrées ({done.length})</h3>
      <div className="grid gap-4">
        {(showAll ? done : done.slice(0, 10)).map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border-l-4 border-blue-500"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">
                    {entry.sport === 'badminton' ? '🏸' : '♟️'}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-800">
                    {entry.sport === 'badminton' ? 'Badminton' : 'Échecs'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    {entry.entry_type === 'match' ? '🎯 Match' : '🏋️ Entraînement'}
                  </span>
                  {entry.entry_type === 'match' && (entry.opponent_level || entry.opponent_name) && (
                    <span className="text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      vs {[entry.opponent_name, entry.opponent_level && legacyLevelLabel(entry.opponent_level)].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  📅 {formatDate(entry.date)}
                </p>
                {entry.set_scores && entry.set_scores.length > 0 && (
                  <p className="mt-1 font-mono font-bold text-gray-800 tracking-wide">
                    🏸 {formatSets(entry.set_scores)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                {entry.score != null && (
                  <div className="text-center bg-blue-50 dark:bg-blue-500/15 rounded-lg px-3 py-1" title="Note de la séance">
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-300">{entry.score}</span>
                    <span className="text-xs text-gray-600">/10</span>
                    <span className="block text-[10px] uppercase tracking-wide text-gray-500">note</span>
                  </div>
                )}
                {entry.entry_type === 'match' && entry.match_result && (
                  <div
                    className={`text-sm font-bold rounded-lg px-2 py-1 ${
                      entry.match_result === 'win'
                        ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200'
                        : entry.match_result === 'loss'
                          ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200'
                    }`}
                  >
                    {entry.match_result === 'win' && '🎉 Victoire'}
                    {entry.match_result === 'loss' && '😔 Défaite'}
                    {entry.match_result === 'draw' && '🤝 Nulle'}
                  </div>
                )}
                {entry.points_delta != null && (
                  <div
                    className={`text-sm font-black rounded-lg px-2 py-1 ${
                      entry.points_delta >= 0
                        ? 'text-green-700 bg-green-50 dark:bg-green-500/15 dark:text-green-300'
                        : 'text-red-700 bg-red-50 dark:bg-red-500/15 dark:text-red-300'
                    }`}
                    title={entry.sport === 'chess' ? 'Variation d’Elo' : 'Points de classement FFBaD'}
                  >
                    {formatPoints(entry.points_delta)} {entry.sport === 'chess' ? 'Elo' : 'pts'}
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(entry)}
                    disabled={exportingId === entry.id}
                    className="px-3 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                    title="Exporter en image"
                  >
                    {exportingId === entry.id ? '...' : '📤'}
                  </button>
                  <button
                    onClick={() => setEditingId(entry.id)}
                    className="px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
                    title="Éditer cette entrée"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    title="Supprimer cette entrée"
                  >
                    {deletingId === entry.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            {entry.notes && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">📝 Impressions</p>
                <p className="text-gray-700">{entry.notes}</p>
              </div>
            )}

            {/* Pre-match plan, reviewed */}
            {(entry.game_plan || (entry.match_goals && entry.match_goals.length > 0)) && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm font-semibold text-indigo-700 mb-2">
                  📋 Préparation
                  {entry.match_goals && entry.match_goals.length > 0 && (
                    <span className="ml-2 font-normal">
                      ({entry.match_goals.filter(g => g.achieved).length}/{entry.match_goals.length} objectifs atteints)
                    </span>
                  )}
                </p>
                {entry.game_plan && <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">🧠 {entry.game_plan}</p>}
                {entry.match_goals && entry.match_goals.length > 0 && <GoalsList goals={entry.match_goals} />}
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

      {done.length > 10 && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {showAll ? 'Afficher moins' : `Voir les ${done.length - 10} entrées plus anciennes`}
        </button>
      )}

      {/* Edit Modal */}
      {editingId && (
        <EditEntryModal
          key={editingId}
          entry={entries.find(e => e.id === editingId)!}
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          onSave={loadEntries}
        />
      )}
    </div>
  );
}
