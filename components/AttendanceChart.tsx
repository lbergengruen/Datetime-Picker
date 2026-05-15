'use client';

import { useMemo } from 'react';
import type { AnalysisSlot } from '@/lib/types';
import { calculateEndTime, formatTime } from '@/lib/utils';

interface AttendanceChartProps {
  slots: AnalysisSlot[];
  totalSubmissions: number;
}

export function AttendanceChart({ slots, totalSubmissions }: AttendanceChartProps) {
  const maxAttendees = useMemo(() => {
    if (slots.length === 0) return 0;
    return Math.max(...slots.map(s => s.attendeeCount));
  }, [slots]);

  if (slots.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Comparación de Asistencia
      </h3>
      
      <div className="space-y-4">
        {slots.map((slot, index) => {
          const endTime = calculateEndTime(slot.slot.startTime, slot.slot.durationMinutes);
          const percentage = maxAttendees > 0 
            ? (slot.attendeeCount / maxAttendees) * 100 
            : 0;
          const isTop3 = index < 3 && slot.attendeeCount > 0;
          
          return (
            <div key={slot.slot.id} className="relative">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {new Date(slot.slot.date).toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatTime(slot.slot.startTime)}–{formatTime(endTime)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-900">
                    {slot.attendeeCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalSubmissions > 0 
                      ? Math.round((slot.attendeeCount / totalSubmissions) * 100) 
                      : 0}%
                  </div>
                </div>
              </div>
              
              {/* Bar */}
              <div className="ml-11">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop3 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
          <span className="text-gray-600">Top 3 mejores opciones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
          <span className="text-gray-600">Otras opciones</span>
        </div>
      </div>
    </div>
  );
}
