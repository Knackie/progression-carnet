'use client';

import Link from 'next/link';

interface PointsDeltaInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PointsDeltaInput({ value, onChange }: PointsDeltaInputProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-orange-900 mb-2">Points de classement</label>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^\d-]/g, '').replace(/(?!^)-/g, '').slice(0, 4))}
          placeholder="ex : 32 ou -10"
          className="w-full px-4 py-3 rounded-lg border-2 border-orange-300 bg-white text-orange-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Link
          href="/dashboard/calculator"
          className="shrink-0 px-3 py-3 rounded-lg border-2 border-orange-300 text-orange-900 font-semibold hover:bg-orange-100"
          title="Calculer les points"
        >
          🧮
        </Link>
      </div>
    </div>
  );
}

export const parsePointsDelta = (value: string) => (value === '' || value === '-' ? null : Number(value));
