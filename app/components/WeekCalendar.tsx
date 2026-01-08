'use client';

import type { Profile, DayCheckIns, StatusLevel } from '@/types/database';

interface WeekCalendarProps {
  userWeekData: {
    profile: Profile;
    weekCheckIns: DayCheckIns[];
  };
  partnerWeekData: {
    profile: Profile | null;
    weekCheckIns: DayCheckIns[];
  };
}

const moodEmojis: Record<StatusLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export default function WeekCalendar({ userWeekData, partnerWeekData }: WeekCalendarProps) {
  const { weekCheckIns: userWeek } = userWeekData;
  const { weekCheckIns: partnerWeek, profile: partnerProfile } = partnerWeekData;

  // Format date for display
  const formatDate = (dateStr: string, index: number, totalDays: number) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);

    // Check if it's today
    if (checkDate.getTime() === today.getTime()) {
      return 'Hari ini';
    }

    // Check if it's yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (checkDate.getTime() === yesterday.getTime()) {
      return 'Kemarin';
    }

    // For other days, show date
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
  };

  const getMoodEmoji = (checkIn: DayCheckIns['morning'] | DayCheckIns['evening']) => {
    if (!checkIn) return '⚪';
    return moodEmojis[checkIn.status_level];
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {userWeek.map((day, index) => {
          const partnerDay = partnerWeek[index];

          return (
            <div
              key={day.date}
              className="flex-shrink-0 w-20 bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-pink-100 shadow-sm"
            >
              {/* Date Label */}
              <div className="text-[10px] font-medium text-gray-600 text-center mb-2 truncate">
                {formatDate(day.date, index, userWeek.length)}
              </div>

              {/* User Moods */}
              <div className="mb-2">
                <div className="text-[8px] text-gray-500 text-center mb-1">Kamu</div>
                <div className="flex gap-1 justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs" title="Pagi">
                      {getMoodEmoji(day.morning)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs" title="Malam">
                      {getMoodEmoji(day.evening)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Partner Moods */}
              {partnerProfile && (
                <div>
                  <div className="text-[8px] text-gray-500 text-center mb-1 truncate">
                    {partnerProfile.name.split(' ')[0]}
                  </div>
                  <div className="flex gap-1 justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs" title="Pagi">
                        {getMoodEmoji(partnerDay.morning)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs" title="Malam">
                        {getMoodEmoji(partnerDay.evening)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
