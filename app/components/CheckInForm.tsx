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
  1: 'Lagi nggak oke',
  2: 'Agak down',
  3: 'Biasa aja',
  4: 'Lumayan baik',
  5: 'Seneng banget!',
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
      setError('Pilih perasaanmu dulu ya');
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
      <div className="bg-white/80 backdrop-blur-sm border-2 border-rose-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-5 mb-3">
          <span className="text-6xl drop-shadow-lg">{moodEmojis[existingCheckIn.status_level]}</span>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800">
              {moodLabels[existingCheckIn.status_level]}
            </p>
          </div>
        </div>

        {existingCheckIn.note && (
          <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4 mt-4 border border-rose-100">
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "{existingCheckIn.note}"
            </p>
          </div>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium mt-4 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
        >
          ✏️ ubah
        </button>
      </div>
    );
  }

  // Show the form (for new check-in or editing)
  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 ${isEditing ? 'border-2 border-rose-300 rounded-2xl p-5 bg-white shadow-lg' : ''}`}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
          {isEditing ? '✨ Ubah perasaanmu' : '💭 Gimana perasaanmu?'}
        </label>

        <div className="flex justify-between gap-2">
          {([1, 2, 3, 4, 5] as StatusLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setStatusLevel(level)}
              className={`flex-1 py-5 rounded-xl border-2 transition-all duration-200 transform ${
                statusLevel === level
                  ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 scale-110 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-rose-200 hover:scale-105 hover:shadow-md'
              }`}
              title={moodLabels[level]}
            >
              <div className={`text-4xl transition-transform ${statusLevel === level ? 'animate-bounce' : ''}`}>
                {moodEmojis[level]}
              </div>
            </button>
          ))}
        </div>
        {statusLevel && (
          <p className="text-center text-sm font-semibold text-rose-600 mt-4 animate-fade-in">
            {moodLabels[statusLevel]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`note-${period}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          📝 Ceritain lebih lanjut <span className="text-xs text-gray-400 font-normal">(kalau mau)</span>
        </label>
        <textarea
          id={`note-${period}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm bg-white shadow-sm transition-all"
          placeholder="Ceritain dong apa yang kamu rasain..."
          maxLength={500}
        />
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 p-4 rounded-xl text-sm border-2 border-red-200 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              if (existingCheckIn) {
                setStatusLevel(existingCheckIn.status_level);
                setNote(existingCheckIn.note || '');
              }
            }}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold transition-all shadow-sm"
          >
            Gak jadi
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !statusLevel}
          className={`${isEditing ? 'flex-1' : 'w-full'} bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95`}
        >
          {loading ? 'Nyimpen...' : isEditing ? 'Simpan' : '💝 Simpan'}
        </button>
      </div>
    </form>
  );
}
