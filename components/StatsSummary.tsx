'use client';

import { Card } from './ui/Card';

interface StatsSummaryProps {
  totalSubmissions: number;
  totalSlots: number;
  bestAttendance: number;
  averageAttendance: number;
}

export function StatsSummary({ 
  totalSubmissions, 
  totalSlots, 
  bestAttendance, 
  averageAttendance 
}: StatsSummaryProps) {
  const stats = [
    {
      label: 'Respuestas',
      value: totalSubmissions,
      icon: '👥',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Horarios',
      value: totalSlots,
      icon: '📅',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Mejor Asistencia',
      value: bestAttendance,
      icon: '🏆',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Promedio',
      value: averageAttendance.toFixed(1),
      icon: '📊',
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">
                {stat.label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
