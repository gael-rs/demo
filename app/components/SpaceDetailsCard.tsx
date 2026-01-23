'use client';

import { Space } from '../types';
import AmenitiesGrid from './AmenitiesGrid';
import WhatsAppButton from './WhatsAppButton';
import { useBooking } from '../context';

interface SpaceDetailsCardProps {
  space: Space;
  onReserve: (space: Space) => void;
}

export default function SpaceDetailsCard({ space, onReserve }: SpaceDetailsCardProps) {
  const { currency, convertPrice } = useBooking();
  const displayPrice = convertPrice(space.dailyRate);
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800/50 border-b border-slate-700">
        <span className="px-3 py-1 bg-emerald-400 text-slate-900 text-sm font-bold rounded-full uppercase">
          {space.category}
        </span>
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{space.location}, {space.city}</span>
        </div>
      </div>

      {/* Image section with price overlay */}
      <div className="relative aspect-video">
        <img
          src={space.image}
          alt={space.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-lg">
          <div className="text-emerald-400 font-bold text-2xl">
            {currency === 'USD' ? '$' : '$'}{displayPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
          </div>
          <div className="text-slate-400 text-xs">
            {space.validityNote}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6">
        <h2 className="text-white text-2xl font-bold mb-6">{space.name}</h2>

        {/* Amenities Grid */}
        <AmenitiesGrid amenityIds={space.amenities} />

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-3">
            DESCRIPCIÓN
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {space.description}
          </p>
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton phoneNumber={space.whatsappNumber} spaceName={space.name} />

        {/* Reserve Button */}
        <button
          onClick={() => onReserve(space)}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          R E S E R V A
        </button>
      </div>
    </div>
  );
}
