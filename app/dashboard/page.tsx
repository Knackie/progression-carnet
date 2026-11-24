'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import EntryForm from '@/components/EntryForm';
import ProgressionGraphs from '@/components/ProgressionGraphs';
import { ProgressionEntry } from '@/lib/types';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<ProgressionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      await loadEntries(user.id);
    };

    checkAuth();
  }, [router]);

  const loadEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('progression_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleEntryCreated = async () => {
    if (user) {
      await loadEntries(user.id);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Carnet de Progression</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <EntryForm onEntryCreated={handleEntryCreated} />
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">Chargement...</div>
            ) : (
              <>
                <ProgressionGraphs entries={entries} />

                <div className="mt-8 rounded-lg bg-white p-6 shadow">
                  <h2 className="text-2xl font-bold mb-4">Dernières entrées</h2>
                  <div className="space-y-4">
                    {entries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg capitalize">
                              {entry.sport === 'badminton' ? '🏸' : '♟️'} {entry.sport} - {entry.entry_type === 'match' ? 'Match' : 'Entraînement'}
                            </p>
                            <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          {entry.score && (
                            <div className="rounded-full bg-blue-100 px-3 py-1">
                              <span className="font-bold text-blue-600">{entry.score}/10</span>
                            </div>
                          )}
                        </div>
                        {entry.notes && <p className="mt-2 text-gray-700">{entry.notes}</p>}
                        {entry.strengths.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-green-600">Forces: {entry.strengths.join(', ')}</p>
                          </div>
                        )}
                        {entry.weaknesses.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-red-600">Faiblesses: {entry.weaknesses.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
