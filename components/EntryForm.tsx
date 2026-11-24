'use client';

import { useState } from 'react';
import { Sport, ProgressionEntry } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface EntryFormProps {
  onEntryCreated?: (entry: ProgressionEntry) => void;
  sport?: Sport;
}

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'badminton', label: 'Badminton' },
  { value: 'chess', label: 'Échecs' },
];

export default function EntryForm({ onEntryCreated, sport }: EntryFormProps) {
  const [selectedSport, setSelectedSport] = useState<Sport>(sport || 'badminton');
  const [entryType, setEntryType] = useState<'match' | 'training'>('match');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState('5');
  
  // Analyse guidée
  const [strengths, setStrengths] = useState(['', '', '']);
  const [weaknesses, setWeaknesses] = useState(['', '', '']);
  const [errors, setErrors] = useState(['']);
  const [axes, setAxes] = useState(['', '', '']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Vous devez être connecté');
        setLoading(false);
        return;
      }

      const entry = {
        user_id: user.id,
        sport: selectedSport,
        date,
        entry_type: entryType,
        notes,
        score: score ? parseInt(score) : undefined,
        strengths: strengths.filter(s => s.trim()),
        weaknesses: weaknesses.filter(w => w.trim()),
        errors: errors.filter(e => e.trim()),
        improvement_axes: axes.filter(a => a.trim()),
      };

      const { data, error: err } = await supabase
        .from('progression_entries')
        .insert([entry])
        .select()
        .single();

      if (err) throw err;

      // Réinitialiser le formulaire
      setNotes('');
      setScore('5');
      setStrengths(['', '', '']);
      setWeaknesses(['', '', '']);
      setErrors(['']);
      setAxes(['', '', '']);

      if (onEntryCreated && data) {
        onEntryCreated(data);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'entrée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
      <h2 className="text-2xl font-bold">Nouvelle entrée</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sport</label>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as Sport)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            {SPORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as 'match' | 'training')}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="match">Match</option>
            <option value="training">Entraînement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Score (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes libres</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 h-24"
          placeholder="Vos impressions, ressentis..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">3 Points forts</label>
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
            placeholder={`Point fort ${i + 1}`}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">3 Points faibles</label>
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
            placeholder={`Point faible ${i + 1}`}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Erreurs principales</label>
        {errors.map((error, i) => (
          <input
            key={`error-${i}`}
            type="text"
            value={error}
            onChange={(e) => {
              const newErrors = [...errors];
              newErrors[i] = e.target.value;
              setErrors(newErrors);
            }}
            placeholder={`Erreur ${i + 1}`}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        ))}
        <button
          type="button"
          onClick={() => setErrors([...errors, ''])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Ajouter une erreur
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">3 Axes de progression</label>
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
            placeholder={`Axe de progression ${i + 1}`}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        ))}
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-red-800">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Créer l\'entrée'}
      </button>
    </form>
  );
}
