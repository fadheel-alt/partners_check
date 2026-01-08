import type { Profile, DailyCheckIns } from '@/types/database';
import { CoupleHeartIcon } from './icons/RomanticIcons';

interface PartnerStatusProps {
  partner: Profile | null;
  checkIns: DailyCheckIns;
}

const moodEmojis: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const moodLabels: Record<number, string> = {
  1: 'Lagi sedih banget',
  2: 'Agak down',
  3: 'Biasa aja',
  4: 'Lumayan seneng',
  5: 'Seneng banget!',
};

function CheckInCard({
  period,
  checkIn
}: {
  period: 'morning' | 'evening';
  checkIn: DailyCheckIns['morning'] | DailyCheckIns['evening'];
}) {
  const periodLabel = period === 'morning' ? 'Pagi' : 'Malam';
  const periodIcon = period === 'morning' ? '🌅' : '🌙';
  const bgColor = period === 'morning'
    ? 'bg-amber-50/50'
    : 'bg-indigo-50/50';
  const textColor = period === 'morning' ? 'text-amber-600' : 'text-indigo-600';

  if (!checkIn) {
    return (
      <div className={`${bgColor} rounded-lg p-3 border border-dashed border-gray-200 flex-1`}>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm opacity-50">{periodIcon}</span>
          <p className={`text-xs font-medium ${textColor}`}>{periodLabel}</p>
        </div>
        <div className="text-center py-2">
          <span className="text-2xl opacity-30">💭</span>
          <p className="text-[10px] text-gray-400 mt-1">Belum cerita</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-lg p-3 border border-gray-200 flex-1`}>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-sm">{periodIcon}</span>
        <p className={`text-xs font-medium ${textColor}`}>{periodLabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl">{moodEmojis[checkIn.status_level]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{moodLabels[checkIn.status_level]}</p>
        </div>
      </div>
      {checkIn.note && (
        <div className="mt-2 bg-white/60 rounded-md p-2 border border-white/50">
          <p className="text-[10px] text-gray-600 leading-snug italic line-clamp-2">
            "{checkIn.note}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function PartnerStatus({ partner, checkIns }: PartnerStatusProps) {
  if (!partner) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2 opacity-40">💔</div>
        <p className="text-gray-500 text-xs font-medium">
          Belum ada pasangan yang terhubung
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CoupleHeartIcon size="md" className="opacity-50" />
        <h2 className="text-lg font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
          {partner.name}
        </h2>
      </div>

      <div className="flex gap-3">
        <CheckInCard period="morning" checkIn={checkIns.morning} />
        <CheckInCard period="evening" checkIn={checkIns.evening} />
      </div>
    </div>
  );
}
