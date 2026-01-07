'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchTodayStatus } from '@/lib/queries';
import CheckInForm from './components/CheckInForm';
import PartnerStatus from './components/PartnerStatus';
import type { TodayStatus } from '@/types/database';
import { SparkleIcon } from './components/icons/RomanticIcons';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch today's status
        const status = await fetchTodayStatus();
        setTodayStatus(status);
      } catch (error) {
        console.error('Failed to fetch today status:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 bg-hearts-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse text-4xl">💕</div>
          <div className="text-gray-600 font-medium">Tunggu sebentar ya...</div>
        </div>
      </div>
    );
  }

  if (!todayStatus) {
    return null;
  }

  const { user: currentUser, partner } = todayStatus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 bg-hearts-pattern px-4 py-8">
      <div className="max-w-mobile mx-auto space-y-8">
        {/* Header - Elegant */}
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-rose-100">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              {currentUser.profile.name}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-rose-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            Keluar
          </button>
        </div>

        {/* Partner Status Section - Primary Focus with Heart Theme */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-rose-100 hover:shadow-xl transition-shadow duration-300 animate-slide-up hover:animate-glow-pulse">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl animate-pulse">💕</span>
            <h2 className="text-sm font-semibold text-rose-600 uppercase tracking-wide">Pasanganmu</h2>
          </div>
          <PartnerStatus
            partner={partner.profile}
            checkIns={partner.checkIns}
          />
        </div>

        {/* Elegant Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
          <SparkleIcon size="md" className="animate-sparkle" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
        </div>

        {/* User Check-in Section - Beautiful & Warm */}
        <div className="space-y-6 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100 animate-slide-up">
          <h2 className="text-lg font-semibold text-center bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
            Gimana perasaanmu hari ini?
          </h2>

          {/* Morning Check-in */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌅</span>
              <div className="text-sm font-semibold text-amber-700">Pagi hari</div>
            </div>
            <CheckInForm
              period="morning"
              existingCheckIn={currentUser.checkIns.morning}
              onSuccess={() => {
                window.location.reload();
              }}
            />
          </div>

          {/* Evening Check-in */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌙</span>
              <div className="text-sm font-semibold text-indigo-700">Malam hari</div>
            </div>
            <CheckInForm
              period="evening"
              existingCheckIn={currentUser.checkIns.evening}
              onSuccess={() => {
                window.location.reload();
              }}
            />
          </div>
        </div>

        {/* Footer - Date with Heart */}
        <div className="text-center pt-4 space-y-2">
          <div className="text-xs text-gray-500 font-medium">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="text-lg opacity-60">💝</div>
        </div>
      </div>
    </div>
  );
}
