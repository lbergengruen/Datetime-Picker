'use client';

import { useState } from 'react';
import { RehearsalSlot } from '@prisma/client';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SlotCard } from './SlotCard';
import { submitAvailability } from '@/lib/actions';

interface SubmissionFormProps {
  slots: RehearsalSlot[];
}

export function SubmissionForm({ slots }: SubmissionFormProps) {
  const [name, setName] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSlotToggle = (slotId: string, selected: boolean) => {
    const newSelected = new Set(selectedSlots);
    if (selected) {
      newSelected.add(slotId);
    } else {
      newSelected.delete(slotId);
    }
    setSelectedSlots(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await submitAvailability({
        participantName: name,
        slotIds: Array.from(selectedSlots),
      });

      if (result.success) {
        setSuccess(true);
        setName('');
        setSelectedSlots(new Set());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnother = () => {
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks!</h2>
          <p className="text-gray-600">Your availability was recorded.</p>
        </div>
        <Button onClick={handleSubmitAnother}>
          Submit Another Response
        </Button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">No rehearsal slots available yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Your Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          maxLength={100}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select all rehearsal slots you can attend:
          </label>
          <div className="space-y-3">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                selectable
                selected={selectedSlots.has(slot.id)}
                onSelect={handleSlotToggle}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !name.trim() || selectedSlots.size === 0}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Availability'}
        </Button>
      </form>
    </div>
  );
}
