'use client';

import { useBooking } from '../context';
import { UNIT } from '../data';

export default function UnitSelection() {
  const { selectUnit, goToStep } = useBooking();

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => goToStep('landing')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">Selecciona tu espacio</h1>
        <p className="text-slate-400 mb-6">Ciudad de México</p>

        <div
          onClick={() => selectUnit(UNIT)}
          className="bg-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all active:scale-[0.99]"
        >
          <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-slate-500 text-sm">Imagen del inmueble</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{UNIT.name}</h2>
                <p className="text-slate-400 text-sm">{UNIT.address}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold text-lg">${UNIT.basePrice}</p>
                <p className="text-slate-500 text-xs">MXN/día</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {UNIT.amenities.map(amenity => (
                <span
                  key={amenity}
                  className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Disponible ahora
              </span>
              <span className="text-slate-400 text-sm">
                Precio baja con más días
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Demo: Solo 1 unidad disponible
        </p>
      </div>
    </div>
  );
}
