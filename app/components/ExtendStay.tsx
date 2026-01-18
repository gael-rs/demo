'use client';

import { useState } from 'react';
import { useBooking } from '../context';
import { PRICING_TIERS, calculatePrice } from '../data';

export default function ExtendStay() {
  const { state, extendStay, goToStep } = useBooking();
  const [newTotalDays, setNewTotalDays] = useState(state.days + 7);

  const currentPricing = calculatePrice(state.days);
  const newPricing = calculatePrice(newTotalDays);
  const additionalDays = newTotalDays - state.days;
  const additionalCost = newPricing.total - currentPricing.total;

  const handleDaysChange = (days: number) => {
    const clamped = Math.max(state.days + 1, Math.min(365, days));
    setNewTotalDays(clamped);
  };

  const handleExtend = () => {
    extendStay(newTotalDays);
  };

  const quickOptions = [7, 14, 30, 60];

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => goToStep('access-granted')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">Extender estadía</h1>
        <p className="text-slate-400 mb-8">El precio por día se recalcula según el total de días</p>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="mb-6 pb-6 border-b border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Estadía actual</p>
            <div className="flex justify-between items-center">
              <span className="text-white">{state.days} días</span>
              <span className="text-white">${currentPricing.total.toLocaleString()} MXN</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">${currentPricing.pricePerDay}/día</p>
          </div>

          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-4">Agregar días</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickOptions.map(days => (
                <button
                  key={days}
                  onClick={() => setNewTotalDays(state.days + days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    newTotalDays === state.days + days
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  +{days} días
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDaysChange(newTotalDays - 1)}
                disabled={newTotalDays <= state.days + 1}
                className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <p className="text-3xl font-bold text-white">+{additionalDays}</p>
                <p className="text-slate-400 text-sm">días adicionales</p>
              </div>
              <button
                onClick={() => handleDaysChange(newTotalDays + 1)}
                disabled={newTotalDays >= 365}
                className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-3">Nueva estadía total</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total días</span>
                <span className="text-white font-semibold">{newTotalDays} días</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Nuevo precio/día</span>
                <span className={`font-semibold ${newPricing.pricePerDay < currentPricing.pricePerDay ? 'text-emerald-400' : 'text-white'}`}>
                  ${newPricing.pricePerDay}/día
                  {newPricing.pricePerDay < currentPricing.pricePerDay && (
                    <span className="text-xs ml-1">(-${currentPricing.pricePerDay - newPricing.pricePerDay})</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-slate-400">Costo adicional</span>
                <span className="text-xl font-bold text-emerald-400">
                  ${additionalCost.toLocaleString()} MXN
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-400 font-medium">Mejor precio por día</p>
              <p className="text-slate-400 text-sm">
                Al extender, el precio total se recalcula con una mejor tarifa diaria.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <p className="text-slate-400 text-sm font-medium mb-3">Tabla de precios</p>
          <div className="space-y-2">
            {PRICING_TIERS.slice(0, 4).map((tier, index) => {
              const isActive = newTotalDays >= tier.minDays && newTotalDays <= tier.maxDays;
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  <span className="text-sm">{tier.minDays}-{tier.maxDays} días</span>
                  <span className={`font-medium ${isActive ? 'text-emerald-400' : 'text-slate-300'}`}>
                    ${tier.pricePerDay}/día
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleExtend}
          className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
        >
          Pagar extensión ${additionalCost.toLocaleString()} MXN
        </button>

      </div>
    </div>
  );
}
