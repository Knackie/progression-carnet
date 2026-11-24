'use client';

import { useState } from 'react';
import { Sport } from '@/lib/types';

interface QuickEntryFormProps {
  onEntryCreated?: () => void;
}

const SPORTS: { value: Sport; label: string; emoji: string }[] = [
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'chess', label: 'Échecs', emoji: '♟️' },
];

export default function QuickEntryForm({ onEntryCreated }: QuickEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport>('badminton');
  const [entryType, setEntryType] = useState<'match' | 'training'>('match');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState('5');
  const [notes, setNotes] = useState('');
  const [strengths, setStrengths] = useState(['', '', '']);
  const [weaknesses, setWeaknesses] = useState(['', '', '']);
  const [axes, setAxes] = useState(['', '', '']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const sessionStr = localStorage.getItem('sb-session');
      if (!sessionStr) {
        throw new Error('Session non trouvée');
      }

      const session = JSON.parse(sessionStr);
      if (!session.access_token) {
        throw new Error('Token d\'accès invalide');
      }

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          sport: selectedSport,
          date,
          entry_type: entryType,
          notes,
          score: parseInt(score),
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
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 text-lg shadow-lg"
      >
        ➕ Nouvelle Entrée
      </button>
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
                <label className="block text-sm font-bold text-blue-900 mb-2">Score</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="flex-1 h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-blue-600 text-white font-bold px-3 py-2 rounded-lg min-w-fit">{score}/10</div>
                </div>
              </div>
            </div>
          </div>

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
                  placeholder={`Ex: Bon service, Réflexes rapides...`}
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
                  placeholder={`Ex: Concentration, Jeu en défense...`}
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
                  placeholder={`Ex: Améliorer le smash, Travailler l'endurance...`}
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
