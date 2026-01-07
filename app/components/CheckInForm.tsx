'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Period, StatusLevel, CheckIn } from '@/types/database';
import { getTodayDate } from '@/lib/queries';

interface CheckInFormProps {
  period: Period;
  existingCheckIn: CheckIn | null;
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
  const [isEditing, setIsEditing] = useState(false);
  const [statusLevel, setStatusLevel] = useState<StatusLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing check-in data when component mounts or existingCheckIn changes
  useEffect(() => {
    if (existingCheckIn) {
      setStatusLevel(existingCheckIn.status_level);
      setNote(existingCheckIn.note || '');
    }
  }, [existingCheckIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusLevel) {
      setError('Pilih Perasaan Kamu Hari Ini dulu ya');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (existingCheckIn) {
        // UPDATE existing check-in
        const { error: updateError } = await supabase
          .from('checkins')
          .update({
            status_level: statusLevel,
            note: note.trim() || null,
          })
          .eq('id', existingCheckIn.id);

        if (updateError) {
          throw updateError;
        } else {
          setIsEditing(false);
          onSuccess();
        }
      } else {
        // INSERT new check-in
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
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit check-in');
    } finally {
      setLoading(false);
    }
  };

  // If existing check-in and not editing, show the summary view
  if (existingCheckIn && !isEditing) {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-800 font-medium">
              Yeay! Kamu udah isi {period} session
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 underline font-medium"
            >
              Edit
            </button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{moodEmojis[existingCheckIn.status_level]}</span>
            <div>
              <p className="text-sm text-gray-600">{moodLabels[existingCheckIn.status_level]}</p>
            </div>
          </div>

          {existingCheckIn.note && (
            <p className="text-sm text-gray-700 bg-white rounded p-2 mt-2">
              "{existingCheckIn.note}"
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show the form (for new check-in or editing)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          {isEditing ? `Edit ${period} session` : `Gimana Perasaan Kamu? (${period})`}
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
          Apa yang lagi kamu rasain?
        </label>
        <textarea
          id={`note-${period}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Jelasin perasaan kamu lebih detail..."
          maxLength={500}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              // Reset to original values
              if (existingCheckIn) {
                setStatusLevel(existingCheckIn.status_level);
                setNote(existingCheckIn.note || '');
              }
            }}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 font-medium"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !statusLevel}
          className={`${isEditing ? 'flex-1' : 'w-full'} bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
        >
          {loading ? 'Okay, lagi loading nih...' : isEditing ? 'Update' : `Submit ${period} session`}
        </button>
      </div>
    </form>
  );
}
