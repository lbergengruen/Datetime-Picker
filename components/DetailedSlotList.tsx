'use client';

import { useState } from 'react';
import type { AnalysisSlot } from '@/lib/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { calculateEndTime, formatTime } from '@/lib/utils';

interface DetailedSlotListProps {
  slots: AnalysisSlot[];
  totalSubmissions: number;
}

export function DetailedSlotList({ slots, totalSubmissions }: DetailedSlotListProps) {
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  if (slots.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No hay horarios disponibles para analizar.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((analysisSlot, index) => {
        const { slot, attendeeCount, attendees, attendanceRate } = analysisSlot;
        const endTime = calculateEndTime(slot.startTime, slot.durationMinutes);
        const isTop3 = index < 3 && attendeeCount > 0;
        const isExpanded = expandedSlot === slot.id;
        const isEmpty = attendeeCount === 0;

        return (
          <Card 
            key={slot.id} 
            className={`overflow-hidden transition-all ${
              isTop3 ? 'border-green-300 ring-1 ring-green-200' : ''
            } ${isEmpty ? 'opacity-60' : ''}`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${isTop3 
                    ? 'bg-green-100 text-green-700' 
                    : isEmpty 
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-100 text-blue-700'
                  }
                `}>
                  {index === 0 && attendeeCount > 0 ? (
                    <span className="text-lg">🏆</span>
                  ) : (
                    <span className="font-bold text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900">
                      {new Date(slot.date).toLocaleDateString('es-ES', { 
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </h4>
                    {isTop3 && (
                      <Badge variant="success">Mejor Opción</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatTime(slot.startTime)} – {formatTime(endTime)} 
                    <span className="text-gray-400 mx-2">•</span>
                    {slot.durationMinutes} minutos
                  </p>
                </div>

                {/* Attendance */}
                <div className="text-right flex-shrink-0">
                  <div className={`
                    text-2xl font-bold
                    ${isTop3 ? 'text-green-600' : isEmpty ? 'text-gray-400' : 'text-gray-900'}
                  `}>
                    {attendeeCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {attendanceRate}% asistencia
                  </div>
                </div>
              </div>

              {/* Attendees List */}
              {attendeeCount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    {isExpanded ? '▼' : '▶'} 
                    {isExpanded ? 'Ocultar' : 'Ver'} {attendeeCount} {attendeeCount === 1 ? 'asistente' : 'asistentes'}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attendees.map((name) => (
                        <span 
                          key={name} 
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isEmpty && (
                <div className="mt-3 text-sm text-gray-400 italic">
                  Sin disponibilidad registrada
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
