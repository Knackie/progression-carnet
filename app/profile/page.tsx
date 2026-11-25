'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerProfile as PlayerProfileType, Sport } from '@/lib/types';
import { SPORT_LABELS, sportDetails } from '@/lib/sportProfile';
import { findBadmintonRank, nextBadmintonRank } from '@/lib/rankings';
import { authFetch, SessionExpiredError } from '@/lib/authFetch';

interface MatchStats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageScore: number;
  lastMatchDate?: string;
  bestScore: number;
  worstScore: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfileType | null>(null);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewSport, setViewSport] = useState<Sport | null>(null);

  useEffect(() => {
    const loadProfileAndStats = async () => {
      try {
        const [profileResponse, statsResponse] = await Promise.all([
          authFetch('/api/player-profile'),
          authFetch('/api/entries/stats'),
        ]);

        if (profileResponse.ok) {
          const { data } = await profileResponse.json();
          setProfile(data);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        setError('');
      } catch (err) {
        if (err instanceof SessionExpiredError) {
          router.push('/auth/login');
          return;
        }
        console.error('Erreur:', err);
        setError('Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndStats();
  }, [router]);

  const handleProfileSaved = (saved: PlayerProfileType) => {
    setProfile(saved);
    setIsEditingProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="mb-6 px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold inline-flex items-center gap-2"
          >
            ← Tableau de bord
          </Link>
          
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-purple-200">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pas de profil trouvé</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore créé votre profil joueur.</p>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition transform hover:scale-105"
            >
              ➕ Créer mon profil
            </button>
          </div>

          {isEditingProfile && (
            <PlayerProfile
              startEditing
              onClose={() => setIsEditingProfile(false)}
              onSaved={handleProfileSaved}
            />
          )}
        </div>
      </div>
    );
  }

  const sports = profile.sports ?? [];
  const activeSport: Sport = viewSport && sports.includes(viewSport) ? viewSport : sports[0] ?? 'badminton';
  const details = sportDetails(profile, activeSport);
  const sportEmoji = sports.map(s => (s === 'badminton' ? '🏸' : '♟️')).join(' ') || '🏅';
  const sportLabel = sports.map(s => (s === 'badminton' ? 'Badminton' : 'Échecs')).join(', ') || 'Aucun sport';
  const nextRank = profile.current_ranking ? nextBadmintonRank(profile.current_ranking) : null;
  const targetRank = findBadmintonRank(profile.target_ranking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-purple-600 hover:text-purple-800 min-w-0">
            <span>←</span>
            <Logo size={36} showText={false} />
            <span className="truncate">Tableau de bord</span>
          </Link>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shrink-0"
          >
            ✏️ <span className="hidden sm:inline">Éditer le profil</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200 mb-8">
          {/* Infos principales */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b-2 border-purple-100">
            {/* Nom & Sport */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-7xl">{sportEmoji}</div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xl text-purple-600 font-semibold">{sportLabel}</p>
                </div>
              </div>
              {profile.age && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Âge:</span> {profile.age} ans
                </p>
              )}
              {profile.bio && (
                <p className="text-gray-700 italic mt-4 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  "{profile.bio}"
                </p>
              )}
            </div>

            {/* Stats rapides */}
            {stats && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 md:w-80">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Statistiques Rapides</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matchs joués</span>
                    <span className="font-bold text-2xl text-blue-600">{stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Victoires</span>
                    <span className="font-bold text-2xl text-green-600">{stats.wins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-bold text-2xl text-purple-600">{stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                    <span className="text-gray-600">Score moyen</span>
                    <span className="font-bold text-xl text-orange-600">{stats.averageScore.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {sports.length > 1 && (
            <div className="flex gap-2 mb-8">
              {sports.map(s => (
                <button
                  key={s}
                  onClick={() => setViewSport(s)}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition ${
                    activeSport === s ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {SPORT_LABELS[s]}
                </button>
              ))}
            </div>
          )}

          {/* Infos carrière */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {details.playing_style && (
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">🎮 Style de Jeu</h3>
                <p className="text-indigo-800 text-lg">{details.playing_style}</p>
              </div>
            )}
            {details.season_objective && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200">
                <h3 className="text-lg font-bold text-amber-900 mb-3">🎯 Objectif de Saison</h3>
                <p className="text-amber-800 text-lg">{details.season_objective}</p>
              </div>
            )}
          </div>

          {/* Points Forts */}
          {details.key_strengths && details.key_strengths.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">💪 3 Points Forts</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {details.key_strengths.map((strength, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-2xl font-bold text-green-600 mb-2">#{i + 1}</div>
                    <p className="text-green-900 font-semibold">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points Faibles */}
          {details.key_weaknesses && details.key_weaknesses.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200 mb-6">
              <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ 3 Points Faibles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {details.key_weaknesses.map((weakness, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border-2 border-red-300 shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-2xl font-bold text-red-600 mb-2">#{i + 1}</div>
                    <p className="text-red-900 font-semibold">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Axes de Progression */}
          {details.improvement_focus && details.improvement_focus.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-4">🎯 3 Axes de Progression</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {details.improvement_focus.map((axis, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-2xl font-bold text-yellow-600 mb-2">#{i + 1}</div>
                    <p className="text-yellow-900 font-semibold">{axis}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats détaillées */}
          {stats && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">📈 Statistiques Détaillées</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                  <p className="text-gray-600 text-sm mt-1">Matchs joués</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600">{stats.wins}</div>
                  <p className="text-gray-600 text-sm mt-1">Victoires</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border-2 border-red-200">
                  <div className="text-3xl font-bold text-red-600">{stats.losses}</div>
                  <p className="text-gray-600 text-sm mt-1">Défaites</p>
                </div>
                {stats.draws > 0 && (
                  <div className="bg-white rounded-xl p-4 text-center border-2 border-orange-200">
                    <div className="text-3xl font-bold text-orange-600">{stats.draws}</div>
                    <p className="text-gray-600 text-sm mt-1">Nuls</p>
                  </div>
                )}
                <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{stats.bestScore}</div>
                  <p className="text-gray-600 text-sm mt-1">Meilleur score</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border-2 border-pink-200">
                  <div className="text-3xl font-bold text-pink-600">{stats.worstScore}</div>
                  <p className="text-gray-600 text-sm mt-1">Pire score</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Classement */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-xl text-white text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-2">{activeSport === 'chess' ? 'Votre Elo' : 'Votre Classement'}</h2>
          {activeSport === 'chess' ? (
            profile.chess_current_ranking ? (
              <>
                <div className="text-5xl font-bold mb-4">{profile.chess_current_ranking}</div>
                {profile.chess_target_ranking && (
                  <p className="text-xl font-semibold">
                    Objectif : <span className="font-black">{profile.chess_target_ranking}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="text-5xl font-bold mb-4">-</div>
                <p className="text-lg opacity-90">Renseignez votre Elo dans votre profil.</p>
              </>
            )
          ) : profile.current_ranking ? (
            <>
              <div className="text-5xl font-bold mb-4">{profile.current_ranking}</div>
              {nextRank && (
                <p className="text-xl font-semibold">
                  Prochain palier : <span className="font-black">{nextRank}</span>
                  {targetRank && targetRank !== nextRank && (
                    <> · Objectif : <span className="font-black">{targetRank}</span></>
                  )}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="text-5xl font-bold mb-4">-</div>
              <p className="text-lg opacity-90">Renseignez votre classement dans votre profil.</p>
            </>
          )}
          {details.season_objective && (
            <p className="text-lg opacity-90 mt-2">🎯 {details.season_objective}</p>
          )}
          {sports.length < 2 && stats && stats.total > 0 && (
            <p className="text-lg opacity-90 mt-4">
              Forme : <span className="font-bold">{stats.winRate}%</span> de victoires sur <span className="font-bold">{stats.total}</span> matchs
            </p>
          )}
        </div>
      </div>

      {/* Modal d'édition */}
      {isEditingProfile && (
        <PlayerProfile
          startEditing
          onClose={() => setIsEditingProfile(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}
