'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createRehearsalSlot } from '@/lib/actions';
import { formatDateInput } from '@/lib/utils';

export function SlotForm() {
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [startTime, setStartTime] = useState('19:00');
  const [duration, setDuration] = useState('120');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await createRehearsalSlot({
        date: new Date(date),
        startTime,
        durationMinutes: parseInt(duration, 10),
      });

      if (result.success) {
        setStartTime('19:00');
        setDuration('120');
        setDate(formatDateInput(new Date()));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Rehearsal Slot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            type="number"
            label="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="15"
            max="480"
            required
          />
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Slot'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
