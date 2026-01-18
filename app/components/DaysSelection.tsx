'use client';

import { useState } from 'react';
import { useBooking } from '../context';
import { PRICING_TIERS, calculatePrice } from '../data';

export default function DaysSelection() {
  const { state, setDays, goToStep } = useBooking();
  const [selectedDays, setSelectedDays] = useState(state.days);

  const handleDaysChange = (days: number) => {
    const clamped = Math.max(1, Math.min(365, days));
    setSelectedDays(clamped);
    setDays(clamped);
  };

  const pricing = calculatePrice(selectedDays);
  const savings = selectedDays > 7 ? (PRICING_TIERS[0].pricePerDay - pricing.pricePerDay) * selectedDays : 0;

  const quickOptions = [7, 14, 30, 60, 90];

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => goToStep('unit-selection')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">¿Cuántos días?</h1>
        <p className="text-slate-400 mb-8">Mientras más días, mejor precio por día</p>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => handleDaysChange(selectedDays - 1)}
              disabled={selectedDays <= 1}
              className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              -
            </button>
            <div className="text-center min-w-[120px]">
              <input
                type="number"
                value={selectedDays}
                onChange={e => handleDaysChange(parseInt(e.target.value) || 1)}
                className="w-24 text-4xl font-bold text-white bg-transparent text-center outline-none"
                min={1}
                max={365}
              />
              <p className="text-slate-400 text-sm">días</p>
            </div>
            <button
              onClick={() => handleDaysChange(selectedDays + 1)}
              disabled={selectedDays >= 365}
              className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {quickOptions.map(days => (
              <button
                key={days}
                onClick={() => handleDaysChange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDays === days
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {days} días
              </button>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Precio por día</span>
              <span className="text-white font-semibold">${pricing.pricePerDay} MXN</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">{selectedDays} días</span>
              <span className="text-2xl font-bold text-white">${pricing.total.toLocaleString()} MXN</span>
            </div>
            {savings > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                <p className="text-emerald-400 font-medium">
                  Ahorras ${savings.toLocaleString()} MXN vs precio base
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <p className="text-slate-400 text-sm font-medium mb-3">Tabla de precios</p>
          <div className="space-y-2">
            {PRICING_TIERS.map((tier, index) => {
              const isActive = selectedDays >= tier.minDays && selectedDays <= tier.maxDays;
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  <span className="text-sm">
                    {tier.minDays === tier.maxDays
                      ? `${tier.minDays} día`
                      : `${tier.minDays}-${tier.maxDays} días`}
                  </span>
                  <span className={`font-medium ${isActive ? 'text-emerald-400' : 'text-slate-300'}`}>
                    ${tier.pricePerDay}/día
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => goToStep('payment')}
          className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
        >
          Continuar al pago
        </button>
      </div>
    </div>
  );
}
