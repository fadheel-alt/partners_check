export type Period = 'morning' | 'evening';

export type StatusLevel = 1 | 2 | 3 | 4 | 5;

export interface Profile {
  id: string;
  name: string;
  partner_id: string | null;
  created_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  period: Period;
  status_level: StatusLevel;
  note: string | null;
  checkin_date: string; // ISO date string YYYY-MM-DD
  created_at: string;
}

export interface DailyCheckIns {
  morning: CheckIn | null;
  evening: CheckIn | null;
}

export interface TodayStatus {
  user: {
    profile: Profile;
    checkIns: DailyCheckIns;
  };
  partner: {
    profile: Profile | null;
    checkIns: DailyCheckIns;
  };
}

// Form submission type
export interface CheckInFormData {
  period: Period;
  status_level: StatusLevel;
  note?: string;
}

// Week calendar types
export interface DayCheckIns {
  date: string; // YYYY-MM-DD
  morning: CheckIn | null;
  evening: CheckIn | null;
}

export interface WeekStatus {
  user: {
    profile: Profile;
    weekCheckIns: DayCheckIns[]; // 7 days
  };
  partner: {
    profile: Profile | null;
    weekCheckIns: DayCheckIns[]; // 7 days
  };
}
