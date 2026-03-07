'use client';

import { Space } from '../types';
import AmenitiesGrid from './AmenitiesGrid';
import WhatsAppButton from './WhatsAppButton';
import PropertyImageCarousel from './PropertyImageCarousel';
import { useBooking } from '../context';

interface SpaceDetailsCardProps {
  space: Space;
  onReserve: (space: Space) => void;
}

export default function SpaceDetailsCard({ space, onReserve }: SpaceDetailsCardProps) {
  const { currency, convertPrice, authState, openAuthModal } = useBooking();

  const handleReserve = () => {
    if (!authState.isAuthenticated) {
      openAuthModal(() => onReserve(space));
    } else {
      onReserve(space);
    }
  };
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
      <div className="relative">
        <PropertyImageCarousel
          images={(space as any).images || [space.image]}
          propertyName={space.name}
        />
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-lg z-10">
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

        {/* Check-in / Check-out times */}
        <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-slate-700/40 rounded-xl text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Check-in <strong className="text-slate-300">3:00 PM</strong></span>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Check-out <strong className="text-slate-300">12:00 PM</strong></span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton phoneNumber={space.whatsappNumber} spaceName={space.name} />

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          RESERVAR
        </button>
      </div>
    </div>
  );
}
