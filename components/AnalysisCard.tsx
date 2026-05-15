'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { calculateEndTime, formatDate, formatTime } from '@/lib/utils';
import type { AnalysisSlot } from '@/lib/types';

interface AnalysisCardProps {
  analysisSlot: AnalysisSlot;
  rank: number;
}

export function AnalysisCard({ analysisSlot, rank }: AnalysisCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { slot, attendeeCount, attendees, attendanceRate } = analysisSlot;

  const endTime = calculateEndTime(slot.startTime, slot.durationMinutes);
  const dateStr = formatDate(slot.date);
  const startTimeStr = formatTime(slot.startTime);
  const endTimeStr = formatTime(endTime);

  const isTopSlot = rank <= 3 && attendeeCount > 0;

  return (
    <Card className={isTopSlot ? 'border-green-300 bg-green-50' : ''}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {rank === 1 && attendeeCount > 0 && (
                <span className="text-xl">🏆</span>
              )}
              <h3 className="font-semibold text-gray-900">
                {dateStr}
              </h3>
            </div>
            <div className="text-sm text-gray-600">
              {startTimeStr} – {endTimeStr}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isTopSlot ? 'success' : 'default'}>
              {attendeeCount} {attendeeCount === 1 ? 'persona' : 'personas'}
            </Badge>
            {attendanceRate > 0 && (
              <span className="text-xs text-gray-500">
                {attendanceRate}% asistencia
              </span>
            )}
          </div>
        </div>

        {attendeeCount > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {expanded ? 'Ocultar' : 'Ver'} asistentes
            </button>
            {expanded && (
              <div className="mt-2 text-sm text-gray-700">
                {attendees.join(', ')}
              </div>
            )}
          </div>
        )}

        {attendeeCount === 0 && (
          <div className="text-sm text-gray-500 italic">
            Nadie disponible para este horario
          </div>
        )}
      </div>
    </Card>
  );
}
