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
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 text-lg"
      >
        ➕ Nouvelle Entrée
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Nouvelle Entrée</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sport & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as Sport)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SPORTS.map(s => (
                <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as 'match' | 'training')}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="match">🎯 Match</option>
              <option value="training">🏋️ Entraînement</option>
            </select>
          </div>
        </div>

        {/* Date & Score */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Score (0-10)</label>
            <input
              type="range"
              min="0"
              max="10"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">{score}/10</div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Impressions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            placeholder="Vos impressions, comment vous vous sentiez, etc."
          />
        </div>

        {/* Forces */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">💪 3 Points Forts</label>
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
              className="mb-2 w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Faiblesses */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">⚠️ 3 Points Faibles</label>
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
              className="mb-2 w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Axes de progression */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 3 Axes de Progression</label>
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
              className="mb-2 w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm flex items-start gap-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 text-sm flex items-start gap-3">
            <span>✅</span>
            <span>Entrée créée avec succès!</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {loading ? '⏳ Création en cours...' : '💾 Enregistrer l\'entrée'}
        </button>
      </form>
    </div>
  );
}
