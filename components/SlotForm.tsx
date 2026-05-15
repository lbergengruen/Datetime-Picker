'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MultiDatePicker } from './MultiDatePicker';
import { createRehearsalSlots } from '@/lib/actions';
import { formatDateInput, formatDate, formatTime, calculateEndTime } from '@/lib/utils';

interface TimeEntry {
  id: string;
  value: string;
}

export function SlotForm() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [times, setTimes] = useState<TimeEntry[]>([
    { id: '1', value: '19:00' }
  ]);
  const [duration, setDuration] = useState('120');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const previewSlots = useMemo(() => {
    const slots: Array<{ date: string; startTime: string; endTime: string }> = [];
    for (const dateString of selectedDates) {
      for (const time of times) {
        if (!time.value) continue;
        const endTime = calculateEndTime(time.value, parseInt(duration, 10));
        slots.push({
          date: formatDate(new Date(dateString)),
          startTime: formatTime(time.value),
          endTime: formatTime(endTime),
        });
      }
    }
    return slots;
  }, [selectedDates, times, duration]);

  const addTime = () => {
    setTimes([...times, { id: Math.random().toString(36).substr(2, 9), value: '' }]);
  };

  const removeTime = (id: string) => {
    if (times.length > 1) {
      setTimes(times.filter(t => t.id !== id));
    }
  };

  const updateTime = (id: string, value: string) => {
    setTimes(times.map(t => t.id === id ? { ...t, value } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const validDates = selectedDates.map(d => new Date(d));
      const validTimes = times.filter(t => t.value).map(t => t.value);

      if (validDates.length === 0 || validTimes.length === 0) {
        setError('Please select at least one date and add one time');
        setLoading(false);
        return;
      }

      const result = await createRehearsalSlots({
        dates: validDates,
        startTimes: validTimes,
        durationMinutes: parseInt(duration, 10),
      });

      if (result.success) {
        setSuccess(true);
        // Reset form
        setSelectedDates([]);
        setTimes([{ id: '1', value: '19:00' }]);
        setDuration('120');
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
        <CardTitle>Create Rehearsal Slots</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates Section with Multi-Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dates
            </label>
            <MultiDatePicker
              selectedDates={selectedDates}
              onChange={setSelectedDates}
            />
          </div>

          {/* Times Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Times ({times.length})
            </label>
            <div className="space-y-2">
              {times.map((time, index) => (
                <div key={time.id} className="flex gap-2">
                  <Input
                    type="time"
                    value={time.value}
                    onChange={(e) => updateTime(time.id, e.target.value)}
                    required={index === 0}
                    className="flex-1"
                  />
                  {times.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeTime(time.id)}
                      className="px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={addTime}
              className="mt-2 w-full"
            >
              + Add Another Time
            </Button>
          </div>

          {/* Duration */}
          <Input
            type="number"
            label="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="15"
            max="480"
            required
          />

          {/* Preview */}
          {previewSlots.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Will create {previewSlots.length} slot{previewSlots.length !== 1 ? 's' : ''}:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto">
                {previewSlots.map((slot, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {slot.date} — {slot.startTime}–{slot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              ✅ Slots created successfully!
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || previewSlots.length === 0}
            className="w-full"
          >
            {loading ? 'Creating...' : `Create ${previewSlots.length} Slot${previewSlots.length !== 1 ? 's' : ''}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
