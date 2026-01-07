import type { Profile, DailyCheckIns } from '@/types/database';

interface PartnerStatusProps {
  partner: Profile | null;
  checkIns: DailyCheckIns;
}

const moodLabels: Record<number, string> = {
  1: 'Not Happy',
  2: 'Somewhat Down',
  3: 'Neutral',
  4: 'Pretty Good',
  5: 'Really Happy',
};

function CheckInCard({
  period,
  checkIn
}: {
  period: 'morning' | 'evening';
  checkIn: DailyCheckIns['morning'] | DailyCheckIns['evening'];
}) {
  if (!checkIn) {
    return (
      <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
        <p className="text-sm font-medium text-gray-500 mb-1 capitalize">{period}</p>
        <p className="text-gray-400 text-sm">Not checked in yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md p-4 border border-gray-300">
      <p className="text-sm font-medium text-gray-700 mb-2 capitalize">{period}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-bold text-blue-600">{checkIn.status_level}</span>
        <span className="text-sm text-gray-600">{moodLabels[checkIn.status_level]}</span>
      </div>
      {checkIn.note && (
        <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 mt-2">
          "{checkIn.note}"
        </p>
      )}
    </div>
  );
}

export default function PartnerStatus({ partner, checkIns }: PartnerStatusProps) {
  if (!partner) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800 text-sm">
          No partner linked to your account yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {partner.name}'s Today
      </h2>

      <div className="space-y-3">
        <CheckInCard period="morning" checkIn={checkIns.morning} />
        <CheckInCard period="evening" checkIn={checkIns.evening} />
      </div>
    </div>
  );
}
