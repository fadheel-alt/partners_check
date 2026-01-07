'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchTodayStatus } from '@/lib/queries';
import CheckInForm from './components/CheckInForm';
import PartnerStatus from './components/PartnerStatus';
import type { TodayStatus } from '@/types/database';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!todayStatus) {
    return null;
  }

  const { user: currentUser, partner } = todayStatus;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-mobile mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {currentUser.profile.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Logout
          </button>
        </div>

        {/* Partner Status Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <PartnerStatus
            partner={partner.profile}
            checkIns={partner.checkIns}
          />
        </div>

        {/* User Check-in Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Check-ins Today
          </h2>

          {/* Morning Check-in */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Morning</h3>
            <CheckInForm
              period="morning"
              existingCheckIn={!!currentUser.checkIns.morning}
              onSuccess={() => {
                // Reload page to refresh data
                window.location.reload();
              }}
            />
          </div>

          {/* Evening Check-in */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Evening</h3>
            <CheckInForm
              period="evening"
              existingCheckIn={!!currentUser.checkIns.evening}
              onSuccess={() => {
                // Reload page to refresh data
                window.location.reload();
              }}
            />
          </div>
        </div>

        {/* Today's date indicator */}
        <div className="text-center text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
