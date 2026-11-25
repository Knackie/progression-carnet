'use client';

import { useState, useEffect } from 'react';
import { Sport } from '@/lib/types';
import { BADMINTON_RANKING_GROUPS, CHESS_LEVELS, isKnownLevel, legacyLevelLabel } from '@/lib/rankings';
import { authFetch } from '@/lib/authFetch';
import { padToThree } from '@/lib/form';
import { SetInput, SetScore, matchWinner, parseSets, toSetInputs } from '@/lib/badmintonScore';
import SetScoresInput from './SetScoresInput';

interface EditEntryModalProps {
  entry: {
    id: string;
    sport: 'badminton' | 'chess';
    entry_type: 'match' | 'training';
    date: string;
    score?: number | null;
    opponent_level?: string | null;
    match_result?: 'win' | 'loss' | 'draw' | null;
    set_scores?: SetScore[] | null;
    notes: string;
    strengths: string[];
    weaknesses: string[];
    improvement_axes: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SPORTS: { value: Sport; label: string; emoji: string }[] = [
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'chess', label: 'Échecs', emoji: '♟️' },
];

// Exemples dynamiques selon le sport
const EXAMPLES = {
  badminton: {
    strengths: ['Smash puissant', 'Déplacements rapides', 'Jeu au filet excellent'],
    weaknesses: ['Revers faible', 'Service inconsistant', 'Gestion mentale'],
    improvements: ['Travailler le revers', 'Améliorer la régularité du service', 'Mieux gérer la pression'],
  },
  chess: {
    strengths: ['Tactique solide', 'Endgame maîtrisé', 'Prise de risques calculée'],
    weaknesses: ['Ouverture approximative', 'Gestion du temps faible', 'Défense passive'],
    improvements: ['Approfondir les ouvertures', 'Augmenter le temps de jeu', 'Améliorer la défense active'],
  },
};

// Fonction pour obtenir l'exemple selon le sport et le type
const getExample = (sport: 'badminton' | 'chess', type: 'strengths' | 'weaknesses' | 'improvements', index: number) => {
  const examples = EXAMPLES[sport][type];
  return examples[index] || `${type === 'strengths' ? 'Point fort' : type === 'weaknesses' ? 'Point faible' : 'Axe'} ${index + 1}`;
};

export default function EditEntryModal({ entry, isOpen, onClose, onSave }: EditEntryModalProps) {
  const [selectedSport, setSelectedSport] = useState<Sport>(entry.sport);
  const [entryType, setEntryType] = useState<'match' | 'training'>(entry.entry_type);
  const [date, setDate] = useState(entry.date);
  const [score, setScore] = useState<number>(entry.score ?? 5);
  const [opponentLevel, setOpponentLevel] = useState(entry.opponent_level || '');
  const [matchResult, setMatchResult] = useState<'win' | 'loss' | 'draw'>(entry.match_result || 'win');
  const [setInputs, setSetInputs] = useState<SetInput[]>(toSetInputs(entry.set_scores));
  const [notes, setNotes] = useState(entry.notes);
  const [strengths, setStrengths] = useState<string[]>(padToThree(entry.strengths));
  const [weaknesses, setWeaknesses] = useState<string[]>(padToThree(entry.weaknesses));
  const [axes, setAxes] = useState<string[]>(padToThree(entry.improvement_axes));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedSport(entry.sport);
      setEntryType(entry.entry_type);
      setDate(entry.date);
      setScore(entry.score ?? 5);
      setOpponentLevel(entry.opponent_level || '');
      setMatchResult(entry.match_result || 'win');
      setSetInputs(toSetInputs(entry.set_scores));
      setNotes(entry.notes);
      setStrengths(padToThree(entry.strengths));
      setWeaknesses(padToThree(entry.weaknesses));
      setAxes(padToThree(entry.improvement_axes));
      setError('');
    }
  }, [isOpen, entry]);

  const isBadmintonMatch = entryType === 'match' && selectedSport === 'badminton';

  const handleSetsChange = (value: SetInput[]) => {
    setSetInputs(value);
    const winner = matchWinner(parseSets(value).sets);
    if (winner) setMatchResult(winner);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = isBadmintonMatch ? parseSets(setInputs) : { sets: [], error: null };
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    // Only send the field when there is something to save or to clear
    const setScoresField =
      parsed.sets.length || entry.set_scores?.length
        ? { set_scores: parsed.sets.length ? parsed.sets : null }
        : {};

    setLoading(true);
    try {
      const response = await authFetch(`/api/entries/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          date,
          entry_type: entryType,
          notes,
          score,
          opponent_level: entryType === 'match' ? opponentLevel : null,
          match_result: entryType === 'match' ? matchResult : null,
          ...setScoresField,
          strengths: strengths.filter(s => s.trim()),
          weaknesses: weaknesses.filter(w => w.trim()),
          improvement_axes: axes.filter(a => a.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-3xl font-black">✏️ Éditer l'Entrée</h3>
            <p className="text-blue-100 text-sm mt-1">Mettez à jour votre entrée</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-red-700 font-semibold">
              ❌ {error}
            </div>
          )}

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
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    className="flex-1 h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-blue-600 text-white font-bold px-3 py-2 rounded-lg min-w-fit">{score}/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
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
                  {/* Keep values saved with the old P/D/R/N format selectable */}
                  {opponentLevel && !isKnownLevel(opponentLevel) && (
                    <option value={opponentLevel}>{legacyLevelLabel(opponentLevel)}</option>
                  )}
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

          {/* Match Result */}
          {entryType === 'match' && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <h4 className="text-lg font-bold text-orange-900 mb-4">🏆 Résultat du Match</h4>
              {isBadmintonMatch && (
                <div className="mb-4">
                  <SetScoresInput value={setInputs} onChange={handleSetsChange} />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-2">Résultat</label>
                <select
                  value={matchResult}
                  onChange={(e) => setMatchResult(e.target.value as 'win' | 'loss' | 'draw')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-orange-300 bg-white text-orange-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {selectedSport === 'badminton' ? (
                    <>
                      <option value="win">🎉 Victoire</option>
                      <option value="loss">😔 Défaite</option>
                    </>
                  ) : (
                    <>
                      <option value="win">🎉 Victoire</option>
                      <option value="draw">🤝 Nulle</option>
                      <option value="loss">😔 Perte</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Impressions */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-lg font-bold text-purple-900 mb-4">💭 Impressions</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              placeholder="Vos impressions..."
            />
          </div>

          {/* Strengths */}
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-white text-green-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`ex. ${getExample(selectedSport, 'strengths', i)}`}
                />
              ))}
            </div>
          </div>

          {/* Weaknesses */}
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-red-300 bg-white text-red-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={`ex. ${getExample(selectedSport, 'weaknesses', i)}`}
                />
              ))}
            </div>
          </div>

          {/* Improvement Axes */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
            <h4 className="text-lg font-bold text-yellow-900 mb-4">🎯 3 Axes de Progression</h4>
            <div className="space-y-3">
              {axes.map((axis, i) => (
                <input
                  key={`axis-${i}`}
                  type="text"
                  value={axis}
                  onChange={(e) => {
                    const newAxes = [...axes];
                    newAxes[i] = e.target.value;
                    setAxes(newAxes);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 bg-white text-yellow-900 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={`ex. ${getExample(selectedSport, 'improvements', i)}`}
                />
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95"
            >
              {loading ? '⌛ Mise à jour...' : '💾 Enregistrer les modifications'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
