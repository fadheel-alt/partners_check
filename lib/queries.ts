import { supabase } from './supabase';
import type { Profile, CheckIn, DailyCheckIns, TodayStatus } from '@/types/database';

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Fetch check-ins for a specific user and date
export async function fetchCheckInsForDate(
  userId: string,
  date: string
): Promise<DailyCheckIns> {
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', date);

  if (error) throw error;

  const morning = data?.find((c) => c.period === 'morning') || null;
  const evening = data?.find((c) => c.period === 'evening') || null;

  return { morning, evening };
}

// Fetch current user's profile
export async function fetchCurrentProfile(): Promise<Profile> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Fetch partner's profile
export async function fetchPartnerProfile(partnerId: string | null): Promise<Profile | null> {
  if (!partnerId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error) throw error;
  return data;
}

// Fetch complete today's status (user + partner)
export async function fetchTodayStatus(): Promise<TodayStatus> {
  const today = getTodayDate();

  // Fetch current user profile
  const userProfile = await fetchCurrentProfile();

  // Fetch user's check-ins
  const userCheckIns = await fetchCheckInsForDate(userProfile.id, today);

  // Fetch partner profile and check-ins
  let partnerProfile: Profile | null = null;
  let partnerCheckIns: DailyCheckIns = { morning: null, evening: null };

  if (userProfile.partner_id) {
    partnerProfile = await fetchPartnerProfile(userProfile.partner_id);
    partnerCheckIns = await fetchCheckInsForDate(userProfile.partner_id, today);
  }

  return {
    user: {
      profile: userProfile,
      checkIns: userCheckIns,
    },
    partner: {
      profile: partnerProfile,
      checkIns: partnerCheckIns,
    },
  };
}
