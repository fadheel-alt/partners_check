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
  const periodLabel = period === 'morning' ? 'Pagi hari' : 'Malam hari';
  const periodIcon = period === 'morning' ? '🌅' : '🌙';
  const gradientColors = period === 'morning'
    ? 'from-amber-50 to-orange-50 border-amber-200'
    : 'from-indigo-50 to-purple-50 border-indigo-200';
  const textColor = period === 'morning' ? 'text-amber-700' : 'text-indigo-700';

  if (!checkIn) {
    return (
      <div className={`bg-gradient-to-br ${gradientColors} rounded-2xl p-5 border-2 border-dashed opacity-60 hover:opacity-100 transition-opacity`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl opacity-50">{periodIcon}</span>
          <p className={`text-sm font-semibold ${textColor}`}>{periodLabel}</p>
        </div>
        <p className="text-gray-400 text-sm flex items-center gap-2">
          <span className="text-lg">💭</span>
          Belum cerita nih
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${gradientColors} rounded-2xl p-6 border-2 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{periodIcon}</span>
        <p className={`text-sm font-semibold ${textColor}`}>{periodLabel}</p>
      </div>
      <div className="flex items-center gap-5 mb-3">
        <span className="text-6xl drop-shadow-lg">{moodEmojis[checkIn.status_level]}</span>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800">{moodLabels[checkIn.status_level]}</p>
        </div>
      </div>
      {checkIn.note && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mt-4 border border-white/50 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed italic">
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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3 opacity-50">💔</div>
        <p className="text-gray-600 text-sm font-medium">
          Belum ada pasangan yang terhubung
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <CoupleHeartIcon size="lg" className="opacity-60" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          {partner.name}
        </h2>
      </div>

      <div className="space-y-4">
        <CheckInCard period="morning" checkIn={checkIns.morning} />
        <CheckInCard period="evening" checkIn={checkIns.evening} />
      </div>
    </div>
  );
}
