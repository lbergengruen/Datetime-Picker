'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { deleteSubmission } from '@/lib/actions';

interface Submission {
  id: string;
  participantName: string;
  createdAt: Date;
  selectionCount: number;
}

interface SubmissionsManagerProps {
  submissions: Submission[];
}

export function SubmissionsManager({ submissions }: SubmissionsManagerProps) {
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
    // CSV Headers
    const headers = ['Nombre', 'Horarios Seleccionados', 'Fecha de Respuesta'];
    
    // CSV Rows
    const rows = submissions.map(sub => [
      sub.participantName,
      sub.selectionCount.toString(),
      new Date(sub.createdAt).toLocaleString('es-ES')
    ]);
    
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
    link.setAttribute('download', `respuestas_${new Date().toISOString().split('T')[0]}.csv`);
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
