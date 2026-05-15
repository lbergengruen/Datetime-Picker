'use client';

import { RehearsalSlot } from '@prisma/client';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { calculateEndTime, formatDate, formatTime } from '@/lib/utils';

interface SlotCardProps {
  slot: RehearsalSlot;
  onDelete?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function SlotCard({ slot, onDelete, selectable, selected, onSelect }: SlotCardProps) {
  const endTime = calculateEndTime(slot.startTime, slot.durationMinutes);
  const dateStr = formatDate(slot.date);
  const startTimeStr = formatTime(slot.startTime);
  const endTimeStr = formatTime(endTime);

  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect(slot.id, !selected);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(slot.id, e.target.checked);
    }
  };

  if (selectable) {
    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={selected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {dateStr}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {startTimeStr} – {endTimeStr} ({slot.durationMinutes} min)
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {dateStr}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {startTimeStr} – {endTimeStr} ({slot.durationMinutes} min)
          </div>
        </div>
        {onDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(slot.id)}
            className="px-3 py-1.5 min-h-0 h-auto"
          >
            Eliminar
          </Button>
        )}
      </div>
    </Card>
  );
}
