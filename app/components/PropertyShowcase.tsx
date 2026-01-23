'use client';

import Image from 'next/image';
import { SPACES } from '../data';
import { useBooking } from '../context';

export default function PropertyShowcase() {
  const property = SPACES[0]; // Centro de Chile property
  const { currency, convertPrice } = useBooking();
  const displayPrice = convertPrice(property.dailyRate);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Nuestro Inmueble Disponible
        </h2>
        <p className="text-slate-400 text-lg">
          Departamento moderno en el corazón de Santiago
        </p>
      </div>

      {/* Property Card - Modern & Eye-catching */}
      <div className="max-w-2xl mx-auto">
        <div className="group relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

          {/* Card content wrapper */}
          <div className="relative bg-slate-800 rounded-3xl m-[2px]">
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/img/prinipal.jpeg"
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* PRO Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-400 text-slate-900 text-sm font-bold rounded-full uppercase shadow-lg">
                {property.category}
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-xl border border-emerald-500/30 shadow-xl">
                <div className="text-emerald-400 font-bold text-2xl">
                  {currency === 'USD' ? '$' : '$'}{displayPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                </div>
                <div className="text-slate-400 text-xs text-center">{currency}/día</div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />

              {/* Property Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {property.name}
                </h3>
                <div className="flex items-center gap-2 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white font-medium">{property.location}, {property.city}</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {property.description.substring(0, 150)}...
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-700/50 mb-6">
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-xl">30 días</div>
                  <div className="text-slate-500 text-xs">Estadía mínima</div>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-xl">55%</div>
                  <div className="text-slate-500 text-xs">Ahorro vs hotel</div>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-xl">24/7</div>
                  <div className="text-slate-500 text-xs">Acceso digital</div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/50 active:scale-[0.98] flex items-center justify-center gap-2">
                Ver disponibilidad
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
