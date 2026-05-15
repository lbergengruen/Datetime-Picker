'use client';

import { useState } from 'react';
import { RehearsalSlot } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { SlotCard } from './SlotCard';
import { deleteRehearsalSlot, deleteAllRehearsalSlots } from '@/lib/actions';

interface SlotListProps {
  slots: RehearsalSlot[];
}

export function SlotList({ slots }: SlotListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) {
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
    if (!confirm('Are you sure you want to delete ALL rehearsal slots? This cannot be undone.')) {
      return;
    }

    setDeleting('all');
    try {
      await deleteAllRehearsalSlots();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rehearsal Slots ({slots.length})</CardTitle>
          {slots.length > 0 && (
            <Button
              variant="danger"
              onClick={handleDeleteAll}
              disabled={deleting === 'all'}
              className="px-3 py-1.5 min-h-0 h-auto text-xs"
            >
              {deleting === 'all' ? 'Deleting...' : 'Delete All'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No rehearsal slots yet. Add one to get started.
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
