'use client';

import { useState, useEffect } from 'react';
import { Sport, PlayerProfile as SavedProfile } from '@/lib/types';
import { authFetch } from '@/lib/authFetch';
import { padToThree } from '@/lib/form';
import { BADMINTON_RANKS } from '@/lib/rankings';

interface PlayerProfileData {
  id?: string;
  first_name: string;
  last_name: string;
  age?: number;
  sports: Sport[];
  sport?: Sport; // Backward compatibility
  playing_style?: string;
  season_objective?: string;
  current_ranking?: string;
  key_strengths?: string[];
  key_weaknesses?: string[];
  improvement_focus?: string[];
  bio?: string;
}

interface PlayerProfileProps {
  startEditing?: boolean;
  onSaved?: (profile: SavedProfile) => void;
  onClose?: () => void;
}

export default function PlayerProfile({ startEditing = false, onSaved, onClose }: PlayerProfileProps = {}) {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  
  const [formData, setFormData] = useState<PlayerProfileData>({
    first_name: '',
    last_name: '',
    age: undefined,
    sports: [],
    playing_style: '',
    season_objective: '',
    current_ranking: '',
    key_strengths: ['', '', ''],
    key_weaknesses: ['', '', ''],
    improvement_focus: ['', '', ''],
    bio: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await authFetch('/api/player-profile');

      if (response.status === 404) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      const data = await response.json();
      // Convert old format (sport) to new format (sports) if needed
      const profileData = data.data;
      if (profileData && profileData.sport && !profileData.sports) {
        profileData.sports = [profileData.sport];
        delete profileData.sport;
      }
      setProfile(profileData);
      setFormData({
        ...profileData,
        key_strengths: padToThree(profileData.key_strengths),
        key_weaknesses: padToThree(profileData.key_weaknesses),
        improvement_focus: padToThree(profileData.improvement_focus),
      });
    } catch (err) {
      console.error('Load profile error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [
        ...(prev[field as keyof PlayerProfileData] as string[] || []).slice(0, index),
        value,
        ...(prev[field as keyof PlayerProfileData] as string[] || []).slice(index + 1),
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = profile?.id ? `/api/player-profile/${profile.id}` : '/api/player-profile';
      const method = profile?.id ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          key_strengths: formData.key_strengths?.filter(s => s.trim()),
          key_weaknesses: formData.key_weaknesses?.filter(w => w.trim()),
          improvement_focus: formData.improvement_focus?.filter(f => f.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      const data = await response.json();
      setProfile(data.data);
      setIsEditing(false);
      onSaved?.(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    if (startEditing) return null;
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="inline-block animate-spin text-3xl mb-3">⌛</div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile && !isEditing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">👤</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Profil Joueur</h3>
        <p className="text-gray-600 mb-4">Créez votre profil pour mieux tracker votre progression</p>
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
        >
          ➕ Créer mon profil
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h3 className="text-3xl font-black">👤 Mon Profil</h3>
              <p className="text-blue-100 text-sm mt-1">{profile ? 'Mettez à jour' : 'Créez'} votre profil joueur</p>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                if (onClose) onClose();
                else if (!profile) loadProfile();
              }}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Jean"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Dupont"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Âge</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 25"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sports</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sports?.includes('badminton') || false}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          sports: e.target.checked
                            ? [...(prev.sports || []), 'badminton']
                            : (prev.sports || []).filter(s => s !== 'badminton'),
                        }));
                      }}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-gray-700">🏸 Badminton</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sports?.includes('chess') || false}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          sports: e.target.checked
                            ? [...(prev.sports || []), 'chess']
                            : (prev.sports || []).filter(s => s !== 'chess'),
                        }));
                      }}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-gray-700">♟️ Échecs</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <label className="block text-sm font-bold text-blue-900 mb-2">Style de Jeu</label>
              <input
                type="text"
                name="playing_style"
                value={formData.playing_style || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Agressif, Défensif, Équilibré"
              />
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <label className="block text-sm font-bold text-purple-900 mb-2">Objectif de Saison</label>
              <textarea
                name="season_objective"
                value={formData.season_objective || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20 resize-none"
                placeholder="Ex: Atteindre le classement N1, Améliorer ma moyenne de 2 points..."
              />
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
              <label className="block text-sm font-bold text-indigo-900 mb-2">Classement Actuel</label>
              <input
                type="text"
                name="current_ranking"
                list="badminton-ranks"
                value={formData.current_ranking || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: P10, D8, R6… ou 1500 Elo aux échecs"
              />
              <datalist id="badminton-ranks">
                {BADMINTON_RANKS.map(rank => (
                  <option key={rank} value={rank} />
                ))}
              </datalist>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-4">💪 3 Points Forts Majeurs</h4>
              <div className="space-y-3">
                {(formData.key_strengths || []).map((strength, i) => (
                  <input
                    key={`strength-${i}`}
                    type="text"
                    value={strength}
                    onChange={(e) => handleArrayChange('key_strengths', i, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-green-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Point fort ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
              <h4 className="text-lg font-bold text-red-900 mb-4">⚠️ 3 Points Faibles Majeurs</h4>
              <div className="space-y-3">
                {(formData.key_weaknesses || []).map((weakness, i) => (
                  <input
                    key={`weakness-${i}`}
                    type="text"
                    value={weakness}
                    onChange={(e) => handleArrayChange('key_weaknesses', i, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-red-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={`Point faible ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
              <h4 className="text-lg font-bold text-yellow-900 mb-4">🎯 3 Domaines Prioritaires de Progression</h4>
              <div className="space-y-3">
                {(formData.improvement_focus || []).map((focus, i) => (
                  <input
                    key={`focus-${i}`}
                    type="text"
                    value={focus}
                    onChange={(e) => handleArrayChange('improvement_focus', i, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder={`Domaine de progression ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <label className="block text-sm font-bold text-gray-900 mb-2">📝 Biographie</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent h-24 resize-none"
                placeholder="Parlez un peu de vous, votre parcours..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {saving ? '⌛ Sauvegarde...' : '💾 Enregistrer le profil'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border-l-4 border-purple-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-5xl">👤</div>
            <div>
              <h2 className="text-3xl font-black text-gray-800">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-purple-600 font-semibold">
                {profile?.sports && profile.sports.length > 0
                  ? profile.sports.map(s => s === 'badminton' ? '🏸 Badminton' : '♟️ Échecs').join(', ')
                  : 'Sport à définir'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          ✏️ Modifier
        </button>
      </div>

      {profile?.age && (
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Âge:</span> {profile.age} ans
        </p>
      )}

      {profile?.playing_style && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-1">Style de Jeu</p>
          <p className="text-blue-800">{profile.playing_style}</p>
        </div>
      )}

      {profile?.season_objective && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
          <p className="text-sm font-semibold text-purple-900 mb-1">Objectif de Saison</p>
          <p className="text-purple-800">{profile.season_objective}</p>
        </div>
      )}

      {profile?.current_ranking && (
        <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-200">
          <p className="text-sm font-semibold text-indigo-900 mb-1">🏆 Classement Actuel</p>
          <p className="text-indigo-800 font-bold text-lg">{profile.current_ranking}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {profile?.key_strengths && profile.key_strengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-2">💪 Forces</p>
            <ul className="space-y-1">
              {profile.key_strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-800">✓ {s}</li>
              ))}
            </ul>
          </div>
        )}

        {profile?.key_weaknesses && profile.key_weaknesses.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Faiblesses</p>
            <ul className="space-y-1">
              {profile.key_weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-red-800">✗ {w}</li>
              ))}
            </ul>
          </div>
        )}

        {profile?.improvement_focus && profile.improvement_focus.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-900 mb-2">🎯 Axes Prioritaires</p>
            <ul className="space-y-1">
              {profile.improvement_focus.map((f, i) => (
                <li key={i} className="text-sm text-yellow-800">→ {f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {profile?.bio && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">📝 Biographie</p>
          <p className="text-gray-800">{profile.bio}</p>
        </div>
      )}
    </div>
  );
}
