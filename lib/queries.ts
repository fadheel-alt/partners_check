import { supabase } from './supabase';
import type { Profile, CheckIn, DailyCheckIns, TodayStatus, DayCheckIns, WeekStatus } from '@/types/database';

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

// Generate array of last 7 dates (YYYY-MM-DD format)
export function getLast7Dates(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

// Fetch check-ins for a date range
export async function fetchCheckInsForDateRange(
  userId: string,
  dates: string[]
): Promise<DayCheckIns[]> {
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .in('checkin_date', dates)
    .order('checkin_date', { ascending: true });

  if (error) throw error;

  // Organize check-ins by date
  const dayCheckIns: DayCheckIns[] = dates.map(date => {
    const morning = data?.find((c) => c.checkin_date === date && c.period === 'morning') || null;
    const evening = data?.find((c) => c.checkin_date === date && c.period === 'evening') || null;

    return {
      date,
      morning,
      evening,
    };
  });

  return dayCheckIns;
}

// Fetch last 7 days status (user + partner)
export async function fetchLast7DaysStatus(): Promise<WeekStatus> {
  const dates = getLast7Dates();

  // Fetch current user profile
  const userProfile = await fetchCurrentProfile();

  // Fetch user's check-ins for last 7 days
  const userWeekCheckIns = await fetchCheckInsForDateRange(userProfile.id, dates);

  // Fetch partner profile and check-ins
  let partnerProfile: Profile | null = null;
  let partnerWeekCheckIns: DayCheckIns[] = dates.map(date => ({
    date,
    morning: null,
    evening: null,
  }));

  if (userProfile.partner_id) {
    partnerProfile = await fetchPartnerProfile(userProfile.partner_id);
    partnerWeekCheckIns = await fetchCheckInsForDateRange(userProfile.partner_id, dates);
  }

  return {
    user: {
      profile: userProfile,
      weekCheckIns: userWeekCheckIns,
    },
    partner: {
      profile: partnerProfile,
      weekCheckIns: partnerWeekCheckIns,
    },
  };
}
