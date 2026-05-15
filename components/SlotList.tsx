'use client';

import { useState } from 'react';
import { RehearsalSlot } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { SlotCard } from './SlotCard';
import { deleteRehearsalSlot, deleteAllRehearsalSlots, deleteAllSubmissions } from '@/lib/actions';

interface SlotListProps {
  slots: RehearsalSlot[];
}

export function SlotList({ slots }: SlotListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [clearingSubmissions, setClearingSubmissions] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      return;
    }

    setDeleting(id);
    try {
      await deleteRehearsalSlot(id);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los horarios de ensayo? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting('all');
    try {
      await deleteAllRehearsalSlots();
    } finally {
      setDeleting(null);
    }
  };

  const handleClearSubmissions = async () => {
    if (!confirm('¿Estás seguro de que quieres borrar TODAS las respuestas de disponibilidad? Los horarios de ensayo se mantendrán. Esta acción no se puede deshacer.')) {
      return;
    }

    setClearingSubmissions(true);
    try {
      await deleteAllSubmissions();
    } finally {
      setClearingSubmissions(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Horarios de Ensayo ({slots.length})</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleClearSubmissions}
              disabled={clearingSubmissions}
              className="px-3 py-1.5 min-h-0 h-auto text-xs"
            >
              {clearingSubmissions ? 'Limpiando...' : 'Limpiar Respuestas'}
            </Button>
            {slots.length > 0 && (
              <Button
                variant="danger"
                onClick={handleDeleteAll}
                disabled={deleting === 'all'}
                className="px-3 py-1.5 min-h-0 h-auto text-xs"
              >
                {deleting === 'all' ? 'Eliminando...' : 'Eliminar Todos'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Aún no hay horarios de ensayo. Agrega uno para comenzar.
          </p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
