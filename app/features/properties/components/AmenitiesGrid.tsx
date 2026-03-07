'use client';

import { AMENITIES } from '@/app/data';

interface AmenitiesGridProps {
  amenityIds: string[];
}

export default function AmenitiesGrid({ amenityIds }: AmenitiesGridProps) {
  const amenities = amenityIds
    .map(id => AMENITIES.find(a => a.id === id))
    .filter(Boolean);

  return (
    <div className="mb-6">
      <h3 className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-4">
        INCLUYE
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {amenities.map((amenity) => (
          <div key={amenity!.id} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-700 border border-slate-600 hover:border-emerald-500 transition-colors flex items-center justify-center">
              <span className="text-2xl">{amenity!.icon}</span>
            </div>
            <span className="text-xs text-slate-400 text-center">
              {amenity!.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
