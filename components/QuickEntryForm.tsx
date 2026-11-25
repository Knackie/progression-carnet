'use client';

import { useState } from 'react';
import { Sport } from '@/lib/types';
import { BADMINTON_RANKING_GROUPS, CHESS_LEVELS } from '@/lib/rankings';
import { authFetch } from '@/lib/authFetch';
import { EMPTY_SETS, SetInput, matchWinner, parseSets } from '@/lib/badmintonScore';
import SetScoresInput, { DerivedResult } from './SetScoresInput';
import PointsDeltaInput, { parsePointsDelta } from './PointsDeltaInput';
import { exampleFor } from '@/lib/sportExamples';

export interface EntryPrefill {
  sport?: Sport;
  date?: string;
  matchResult?: 'win' | 'loss';
  pointsDelta?: number;
  notes?: string;
}

interface QuickEntryFormProps {
  onEntryCreated?: () => void;
  prefill?: EntryPrefill | null;
}

const SPORTS: { value: Sport; label: string; emoji: string }[] = [
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'chess', label: 'Échecs', emoji: '♟️' },
];

export default function QuickEntryForm({ onEntryCreated, prefill }: QuickEntryFormProps) {
  // A prefill (from the points calculator) opens the form directly as a badminton match
  const [isOpen, setIsOpen] = useState(!!prefill);
  const [selectedSport, setSelectedSport] = useState<Sport>(prefill?.sport ?? 'badminton');
  const [entryType, setEntryType] = useState<'match' | 'training'>('match');
  const [date, setDate] = useState(prefill?.date ?? new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState('5');
  const [opponentLevel, setOpponentLevel] = useState('');
  const [matchResult, setMatchResult] = useState<'win' | 'loss' | 'draw'>(prefill?.matchResult ?? 'win');
  const [setInputs, setSetInputs] = useState<SetInput[]>(EMPTY_SETS);
  const [pointsDelta, setPointsDelta] = useState(prefill?.pointsDelta != null ? String(prefill.pointsDelta) : '');
  const [notes, setNotes] = useState(prefill?.notes ?? '');
  const [strengths, setStrengths] = useState(['', '', '']);
  const [weaknesses, setWeaknesses] = useState(['', '', '']);
  const [axes, setAxes] = useState(['', '', '']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isBadmintonMatch = entryType === 'match' && selectedSport === 'badminton';
  // A finished badminton score decides the result; the menu is only for matches without a score
  const liveSets = parseSets(setInputs);
  const derivedResult = isBadmintonMatch && !liveSets.error ? matchWinner(liveSets.sets) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const parsed = isBadmintonMatch ? parseSets(setInputs) : { sets: [], error: null };
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          date,
          entry_type: entryType,
          notes,
          score: parseInt(score),
          opponent_level: entryType === 'match' ? opponentLevel : null,
          match_result: entryType === 'match' ? derivedResult ?? matchResult : null,
          set_scores: parsed.sets.length ? parsed.sets : null,
          points_delta: isBadmintonMatch ? parsePointsDelta(pointsDelta) : null,
          strengths: strengths.filter(s => s.trim()),
          weaknesses: weaknesses.filter(w => w.trim()),
          improvement_axes: axes.filter(a => a.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setSuccess(true);
      setNotes('');
      setScore('5');
      setOpponentLevel('');
      setMatchResult('win');
      setSetInputs(EMPTY_SETS);
      setPointsDelta('');
      setStrengths(['', '', '']);
      setWeaknesses(['', '', '']);
      setAxes(['', '', '']);
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        if (onEntryCreated) onEntryCreated();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div id="quick-entry-form">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 text-lg shadow-lg"
        >
          ➕ Nouvelle Entrée
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-3xl font-black">📝 Nouvelle Entrée</h3>
            <p className="text-blue-100 text-sm mt-1">Enregistrez votre progression</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Section 1: Basics */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="text-lg font-bold text-blue-900 mb-4">🎯 Infos de Base</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Sport</label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value as Sport)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SPORTS.map(s => (
                    <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Type</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as 'match' | 'training')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="match">🎯 Match</option>
                  <option value="training">🏋️ Entraînement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Note de la séance</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                      backgroundSize: `${(parseInt(score) / 10) * 100}% 100%`,
                      backgroundImage: `linear-gradient(to right, #2563eb 0%, #2563eb ${(parseInt(score) / 10) * 100}%, #bfdbfe ${(parseInt(score) / 10) * 100}%, #bfdbfe 100%)`,
                    }}
                  />
                  <div className="bg-blue-600 text-white font-bold px-3 py-2 rounded-lg min-w-fit text-lg">{score}/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1.5: Match Details (only for matches) */}
          {entryType === 'match' && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-4">👥 Détails du Match</h4>
              <div>
                <label className="block text-sm font-bold text-green-900 mb-2">Classement de l'Adversaire</label>
                <select
                  value={opponentLevel}
                  onChange={(e) => setOpponentLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-white text-green-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Sélectionner --</option>
                  {selectedSport === 'badminton'
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
          )}

          {/* Section 1.6: Match Result (only for matches) */}
          {entryType === 'match' && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <h4 className="text-lg font-bold text-orange-900 mb-4">🏆 Résultat du Match</h4>
              {isBadmintonMatch && (
                <div className="mb-4">
                  <SetScoresInput value={setInputs} onChange={setSetInputs} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSport === 'badminton' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-orange-900 mb-2">Résultat</label>
                      {derivedResult ? (
                        <DerivedResult sets={liveSets.sets} />
                      ) : (
                        <select
                          value={matchResult}
                          onChange={(e) => setMatchResult(e.target.value as 'win' | 'loss')}
                          className="w-full px-4 py-3 rounded-lg border-2 border-orange-300 bg-white text-orange-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="win">🎉 Victoire</option>
                          <option value="loss">😔 Défaite</option>
                        </select>
                      )}
                    </div>
                    <PointsDeltaInput value={pointsDelta} onChange={setPointsDelta} />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-orange-900 mb-2">Résultat</label>
                      <select
                        value={matchResult}
                        onChange={(e) => setMatchResult(e.target.value as 'win' | 'loss' | 'draw')}
                        className="w-full px-4 py-3 rounded-lg border-2 border-orange-300 bg-white text-orange-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="win">🎉 Victoire</option>
                        <option value="draw">🤝 Nulle</option>
                        <option value="loss">😔 Perte</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Impressions */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-lg font-bold text-purple-900 mb-4">💭 Impressions</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              placeholder="Comment vous vous sentiez, points importants, éléments à retenir..."
            />
          </div>

          {/* Section 3: Forces */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <h4 className="text-lg font-bold text-green-900 mb-4">💪 3 Points Forts</h4>
            <div className="space-y-3">
              {strengths.map((strength, i) => (
                <input
                  key={`strength-${i}`}
                  type="text"
                  value={strength}
                  onChange={(e) => {
                    const newStrengths = [...strengths];
                    newStrengths[i] = e.target.value;
                    setStrengths(newStrengths);
                  }}
                  placeholder={`ex. ${exampleFor(selectedSport, 'strengths', i)}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                />
              ))}
            </div>
          </div>

          {/* Section 4: Faiblesses */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <h4 className="text-lg font-bold text-red-900 mb-4">⚠️ 3 Points Faibles</h4>
            <div className="space-y-3">
              {weaknesses.map((weakness, i) => (
                <input
                  key={`weakness-${i}`}
                  type="text"
                  value={weakness}
                  onChange={(e) => {
                    const newWeaknesses = [...weaknesses];
                    newWeaknesses[i] = e.target.value;
                    setWeaknesses(newWeaknesses);
                  }}
                  placeholder={`ex. ${exampleFor(selectedSport, 'weaknesses', i)}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-red-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-semibold"
                />
              ))}
            </div>
          </div>

          {/* Section 5: Axes */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-2 border-amber-200">
            <h4 className="text-lg font-bold text-amber-900 mb-4">🎯 3 Axes de Progression</h4>
            <div className="space-y-3">
              {axes.map((axe, i) => (
                <input
                  key={`axe-${i}`}
                  type="text"
                  value={axe}
                  onChange={(e) => {
                    const newAxes = [...axes];
                    newAxes[i] = e.target.value;
                    setAxes(newAxes);
                  }}
                  placeholder={`ex. ${exampleFor(selectedSport, 'improvements', i)}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-semibold"
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-100 border-2 border-red-300 p-4 text-red-800 text-sm flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl bg-green-100 border-2 border-green-300 p-4 text-green-800 text-sm flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">Entrée créée avec succès!</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Création en cours...
              </span>
            ) : (
              '💾 Enregistrer l\'entrée'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
