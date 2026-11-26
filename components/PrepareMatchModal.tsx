'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sport } from '@/lib/types';
import { BADMINTON_RANKING_GROUPS, CHESS_LEVELS } from '@/lib/rankings';
import { authFetch } from '@/lib/authFetch';

interface PrepareMatchModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export default function PrepareMatchModal({ onClose, onCreated }: PrepareMatchModalProps) {
  const [sport, setSport] = useState<Sport>('badminton');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opponentName, setOpponentName] = useState('');
  const [opponentLevel, setOpponentLevel] = useState('');
  const [gamePlan, setGamePlan] = useState('');
  const [goals, setGoals] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filledGoals = goals.map(g => g.trim()).filter(Boolean);
    if (!gamePlan.trim() && filledGoals.length === 0) {
      setError('Ajoutez au moins un plan de jeu ou un objectif');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await authFetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport,
          date,
          entry_type: 'match',
          status: 'planned',
          notes: '',
          score: null,
          opponent_name: opponentName,
          opponent_level: opponentLevel || null,
          game_plan: gamePlan,
          match_goals: filledGoals.map(text => ({ text, achieved: null })),
          strengths: [],
          weaknesses: [],
          improvement_axes: [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde');
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black">📋 Préparer un match</h3>
            <p className="text-indigo-100 text-sm mt-1">Fixez votre plan avant de jouer, faites le bilan après</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition" aria-label="Fermer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 text-red-700 font-semibold">❌ {error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Sport</label>
              <select
                value={sport}
                onChange={e => {
                  setSport(e.target.value as Sport);
                  setOpponentLevel('');
                }}
                className={inputClass}
              >
                <option value="badminton">🏸 Badminton</option>
                <option value="chess">♟️ Échecs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date du match</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adversaire</label>
              <input
                type="text"
                value={opponentName}
                onChange={e => setOpponentName(e.target.value)}
                placeholder="Nom (optionnel)"
                className={inputClass}
              />
              <p className="text-xs text-gray-600 mt-1">
                Facultatif. Voir la{' '}
                <Link href="/confidentialite" className="text-indigo-700 underline" target="_blank" rel="noopener noreferrer">
                  confidentialité
                </Link>.
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Classement</label>
              <select value={opponentLevel} onChange={e => setOpponentLevel(e.target.value)} className={inputClass}>
                <option value="">--</option>
                {sport === 'badminton'
                  ? BADMINTON_RANKING_GROUPS.map(group => (
                      <optgroup key={group.label} label={group.label}>
                        {group.ranks.map(rank => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </optgroup>
                    ))
                  : CHESS_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 sm:p-5 border-2 border-indigo-200">
            <label className="block text-sm font-bold text-indigo-900 mb-2">🧠 Plan de jeu</label>
            <textarea
              value={gamePlan}
              onChange={e => setGamePlan(e.target.value)}
              rows={3}
              placeholder={
                sport === 'badminton'
                  ? 'Ex : le jouer sur son revers, varier les services courts/longs, rester patient en défense'
                  : 'Ex : jouer la Sicilienne, éviter les échanges de dames, garder 10 min pour la finale'
              }
              className={inputClass}
            />
          </div>

          <div className="bg-amber-50 rounded-xl p-4 sm:p-5 border-2 border-amber-200">
            <label className="block text-sm font-bold text-amber-900 mb-2">🎯 Objectifs du match</label>
            <div className="space-y-2">
              {goals.map((goal, i) => (
                <input
                  key={i}
                  type="text"
                  value={goal}
                  onChange={e => setGoals(goals.map((g, j) => (j === i ? e.target.value : g)))}
                  placeholder={`Objectif ${i + 1}`}
                  className={inputClass}
                />
              ))}
            </div>
            <p className="text-xs text-amber-800 mt-2">Après le match, vous cocherez ceux qui sont atteints.</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold disabled:opacity-50"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer la préparation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
