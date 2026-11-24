'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Entry {
  id: string;
  date: string;
  score?: number;
  match_result?: 'win' | 'loss' | 'draw';
  sport: 'badminton' | 'chess';
}

export default function ProgressionGraph() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    loadData();
  }, [isHydrated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const sessionStr = localStorage.getItem('sb-session');
      if (!sessionStr) {
        setError('Session non trouvée');
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionStr);

      const response = await fetch('/api/entries', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      const entries: Entry[] = result.data || [];

      // Group by date and calculate average score
      const grouped: { [key: string]: { badminton: number[]; chess: number[] } } = {};

      entries.forEach((entry) => {
        const dateKey = new Date(entry.date).toLocaleDateString('fr-FR', {
          month: 'short',
          day: 'numeric',
        });

        if (!grouped[dateKey]) {
          grouped[dateKey] = { badminton: [], chess: [] };
        }

        if (entry.score !== undefined) {
          if (entry.sport === 'badminton') {
            grouped[dateKey].badminton.push(entry.score);
          } else {
            grouped[dateKey].chess.push(entry.score);
          }
        }
      });

      // Convert to chart data
      const chartData = Object.entries(grouped)
        .map(([date, scores]) => ({
          date,
          badminton: scores.badminton.length > 0 ? Math.round(scores.badminton.reduce((a, b) => a + b) / scores.badminton.length) : null,
          chess: scores.chess.length > 0 ? Math.round(scores.chess.reduce((a, b) => a + b) / scores.chess.length) : null,
        }))
        .reverse() // Chronological order
        .slice(-30); // Last 30 days

      setData(chartData);
    } catch (err) {
      console.error('Load data error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Chargement du graphique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-gray-600">📊 Pas assez de données pour afficher le graphique</p>
          <p className="text-gray-500 text-sm mt-2">Créez des entrées avec des scores pour voir votre progression!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Votre Progression</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#999"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            domain={[0, 10]}
            stroke="#999"
            style={{ fontSize: '14px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #6366f1',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value) => value ? value : '-'}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="badminton"
            stroke="#f97316"
            dot={{ fill: '#f97316', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="🏸 Badminton"
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="chess"
            stroke="#8b5cf6"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="♟️ Échecs"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
