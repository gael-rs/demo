'use client';

import { useState } from 'react';
import { useBooking } from '../context';

export default function Payment() {
  const { state, processPayment, goToStep, currency, convertPrice } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert prices
  const pricePerDayConverted = convertPrice(state.pricePerDay);
  const totalPriceConverted = convertPrice(state.totalPrice);

  const handlePayment = async () => {
    setIsProcessing(true);
    await processPayment();
    setIsProcessing(false);
  };

  const handleRetry = () => {
    goToStep('payment');
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => goToStep('days-selection')}
          disabled={isProcessing}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">Pago</h1>
        <p className="text-slate-400 mb-8">Completa tu reservación</p>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">{state.selectedUnit?.name}</p>
              <p className="text-slate-400 text-sm">{state.days} días</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Precio por día</span>
              <span className="text-white">{currency === 'USD' ? '$' : '$'}{pricePerDayConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Días</span>
              <span className="text-white">{state.days}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-700">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-emerald-400">{currency === 'USD' ? '$' : '$'}{totalPriceConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}</span>
            </div>
          </div>
        </div>

        {state.paymentStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-medium">Pago fallido</p>
                <p className="text-slate-400 text-sm">El pago no pudo procesarse. Intenta de nuevo.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <p className="text-slate-400 text-sm font-medium mb-3">Método de pago (simulado)</p>
          <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
            <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="text-white text-sm">•••• •••• •••• 4242</p>
              <p className="text-slate-400 text-xs">Tarjeta de prueba</p>
            </div>
          </div>
        </div>

        {isProcessing || state.paymentStatus === 'processing' ? (
          <div className="w-full py-4 px-8 bg-slate-700 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando pago...
          </div>
        ) : state.paymentStatus === 'failed' ? (
          <button
            onClick={handleRetry}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98]"
          >
            Reintentar pago
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Pagar {currency === 'USD' ? '$' : '$'}{totalPriceConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
          </button>
        )}

      </div>
    </div>
  );
}
