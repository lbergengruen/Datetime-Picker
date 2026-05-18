'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { deleteSubmission } from '@/lib/actions';
import type { AnalysisSlot } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';

interface Submission {
  id: string;
  participantName: string;
  createdAt: Date;
  selectionCount: number;
  selections: Array<{ slotId: string }>;
}

interface SubmissionsManagerProps {
  submissions: Submission[];
  slots: AnalysisSlot[];
}

export function SubmissionsManager({ submissions, slots }: SubmissionsManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la respuesta de ${name}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteSubmission(id);
    } finally {
      setDeletingId(null);
    }
  };

  const downloadCSV = () => {
    // Sort slots by date and time for consistent column order
    const sortedSlots = [...slots].sort((a, b) => {
      const dateA = new Date(a.slot.date).getTime();
      const dateB = new Date(b.slot.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.slot.startTime.localeCompare(b.slot.startTime);
    });

    // CSV Headers: Nombre + one column per slot
    const slotHeaders = sortedSlots.map(slot => {
      const date = formatDate(new Date(slot.slot.date));
      const time = formatTime(slot.slot.startTime);
      return `${date} ${time}`;
    });
    const headers = ['Nombre', ...slotHeaders];
    
    // CSV Rows: One row per person, with X if they selected that slot
    const rows = submissions.map(sub => {
      const selectedSlotIds = new Set(sub.selections.map(s => s.slotId));
      const slotValues = sortedSlots.map(slot => 
        selectedSlotIds.has(slot.slot.id) ? 'X' : ''
      );
      return [sub.participantName, ...slotValues];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `disponibilidad_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (submissions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Respuestas Recibidas
        </h3>
        <p className="text-gray-500 text-center py-4">
          Aún no hay respuestas registradas.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Respuestas Recibidas ({submissions.length})
        </h3>
        <Button
          variant="secondary"
          onClick={downloadCSV}
          className="px-3 py-1.5 min-h-0 h-auto text-xs"
        >
          📥 Descargar CSV
        </Button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {submissions.map((submission) => (
          <div 
            key={submission.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {submission.participantName}
              </div>
              <div className="text-sm text-gray-500">
                {submission.selectionCount} horario{submission.selectionCount !== 1 ? 's' : ''} seleccionado{submission.selectionCount !== 1 ? 's' : ''}
                <span className="mx-2 text-gray-300">•</span>
                {new Date(submission.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <Button
              variant="danger"
              onClick={() => handleDelete(submission.id, submission.participantName)}
              disabled={deletingId === submission.id}
              className="px-3 py-1.5 min-h-0 h-auto text-xs ml-2 flex-shrink-0"
            >
              {deletingId === submission.id ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
