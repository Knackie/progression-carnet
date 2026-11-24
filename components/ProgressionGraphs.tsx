'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProgressionEntry } from '@/lib/types';

interface ProgressionGraphsProps {
  entries: ProgressionEntry[];
}

export default function ProgressionGraphs({ entries }: ProgressionGraphsProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ avg: 0, total: 0 });

  useEffect(() => {
    if (!entries.length) return;

    // Regrouper par mois
    const monthlyData: Record<string, { count: number; total_score: number }> = {};
    
    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, total_score: 0 };
      }
      
      monthlyData[monthKey].count += 1;
      if (entry.score) monthlyData[monthKey].total_score += entry.score;
    });

    // Convertir en array pour les graphiques
    const data = Object.entries(monthlyData)
      .sort()
      .map(([month, data]) => ({
        month,
        entries: data.count,
        avg_score: data.total_score / data.count,
      }));

    setChartData(data);

    // Calculer les stats
    const avgScore = entries.filter(e => e.score).length > 0 
      ? entries.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) / entries.filter(e => e.score).length
      : 0;

    setStats({
      avg: Math.round(avgScore * 10) / 10,
      total: entries.length,
    });
  }, [entries]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">Total d'entrées</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">Score moyen</p>
          <p className="text-3xl font-bold text-green-600">{stats.avg}/10</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Entrées par mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entries" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Score moyen par mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg_score" stroke="#10b981" name="Score moyen" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
          <p>Aucune donnée de progression pour le moment</p>
          <p className="text-sm">Crée ta première entrée pour voir les graphiques</p>
        </div>
      )}
    </div>
  );
}
