'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface Submission {
  id: string;
  participantName: string;
  createdAt: Date;
  selectionCount: number;
  selections: Array<{ slotId: string }>;
}

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: Submission[];
  onSelect: (submission: Submission) => void;
}

export function EditSubmissionModal({ isOpen, onClose, submissions, onSelect }: EditSubmissionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSubmissions = submissions.filter(sub =>
    sub.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Editar mi Respuesta
          </h2>
          <p className="text-sm text-gray-600">
            Selecciona tu nombre de la lista para editar tu disponibilidad
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar tu nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aún no hay respuestas registradas.
            </p>
          ) : filteredSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontró ningún nombre con "{searchTerm}"
            </p>
          ) : (
            <div className="space-y-2">
              {filteredSubmissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => onSelect(submission)}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-900">
                        {submission.participantName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.selectionCount} horario{submission.selectionCount !== 1 ? 's' : ''} seleccionado{submission.selectionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(submission.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
