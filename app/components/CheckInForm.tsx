'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Period, StatusLevel } from '@/types/database';
import { getTodayDate } from '@/lib/queries';

interface CheckInFormProps {
  period: Period;
  existingCheckIn: boolean;
  onSuccess: () => void;
}

const moodEmojis: Record<StatusLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const moodLabels: Record<StatusLevel, string> = {
  1: 'Not Happy',
  2: 'Somewhat Down',
  3: 'Neutral',
  4: 'Pretty Good',
  5: 'Really Happy',
};

export default function CheckInForm({ period, existingCheckIn, onSuccess }: CheckInFormProps) {
  const [statusLevel, setStatusLevel] = useState<StatusLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusLevel) {
      setError('Please select a mood level');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('checkins')
        .insert({
          user_id: user.id,
          period,
          status_level: statusLevel,
          note: note.trim() || null,
          checkin_date: getTodayDate(),
        });

      if (insertError) {
        // Handle unique constraint violation
        if (insertError.code === '23505') {
          setError('You have already submitted a check-in for this period today.');
        } else {
          throw insertError;
        }
      } else {
        // Success - reset form and callback
        setStatusLevel(null);
        setNote('');
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit check-in');
    } finally {
      setLoading(false);
    }
  };

  if (existingCheckIn) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
        <p className="text-green-800 font-medium">
          You've already checked in for {period}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          How are you feeling? ({period})
        </label>

        <div className="flex justify-between gap-2">
          {([1, 2, 3, 4, 5] as StatusLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setStatusLevel(level)}
              className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                statusLevel === level
                  ? 'border-blue-600 bg-blue-50 scale-110'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              title={moodLabels[level]}
            >
              <div className="text-3xl">{moodEmojis[level]}</div>
            </button>
          ))}
        </div>
        {statusLevel && (
          <p className="text-center text-sm text-gray-600 mt-2">
            {moodLabels[statusLevel]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`note-${period}`} className="block text-sm font-medium text-gray-700 mb-1">
          Note (optional)
        </label>
        <textarea
          id={`note-${period}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any thoughts to share..."
          maxLength={500}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !statusLevel}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Submitting...' : `Submit ${period} check-in`}
      </button>
    </form>
  );
}
