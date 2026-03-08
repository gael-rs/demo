'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBooking } from '@/app/context';
import { recordTermsAcceptance } from '@/app/features/admin/terms.service';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Payment() {
  const { state, goToStep, currency, convertPrice, authState, setTermsAccepted } = useBooking();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerDayConverted = convertPrice(state.pricePerDay);
  const totalPriceConverted = convertPrice(state.totalPrice);
  const discountConverted = convertPrice(state.discountAmount || 0);
  const fmt = (n: number) => n.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL');

  const checkIn = state.checkInDate || new Date();
  const checkOut = state.checkOutDate || (() => {
    const d = new Date(checkIn); d.setDate(d.getDate() + state.days); return d;
  })();

  const handlePayment = async () => {
    if (!state.termsAccepted) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    if (!authState.user || !state.selectedUnit) { goToStep('auth'); return; }

    setIsRedirecting(true);
    setError(null);

    try {
      // Registrar aceptación de términos antes de redirigir (sin bookingId aún)
      await recordTermsAcceptance(authState.user.id).catch(() => {});

      const sessionId = crypto.randomUUID();

      // Guardar estado en sessionStorage para restaurar al volver de MP
      sessionStorage.setItem('mp_pending_payment', JSON.stringify({
        unitId: state.selectedUnit.id,
        unitName: state.selectedUnit.name,
        days: state.days,
        totalPrice: state.totalPrice,
        pricePerDay: state.pricePerDay,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        basePricePerDay: state.basePricePerDay,
        discountPercentage: state.discountPercentage,
        discountAmount: state.discountAmount,
      }));

      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: authState.user.id,
          propertyId: state.selectedUnit.id,
          unitName: state.selectedUnit.name,
          days: state.days,
          pricePerDay: state.pricePerDay,
          totalPriceCLP: state.totalPrice,
          basePriceCLP: state.basePricePerDay || state.pricePerDay,
          discountPercentage: state.discountPercentage || 0,
          discountAmountCLP: state.discountAmount || 0,
          checkIn: checkIn.toISOString().split('T')[0],
          checkOut: checkOut.toISOString().split('T')[0],
          userEmail: authState.user.email,
          userName: authState.user.name,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con MercadoPago');

      const { initPoint, sandboxInitPoint } = await response.json();
      const checkoutUrl = sandboxInitPoint || initPoint;
      if (!checkoutUrl) throw new Error('No se recibió URL de checkout de MercadoPago');
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar el pago');
      setIsRedirecting(false);
    }
  };

  const unit = state.selectedUnit;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => goToStep('days-selection')}
          disabled={isRedirecting}
          className="flex items-center gap-2 text-slate-400 hover:text-white mt-8 mb-6 transition-colors disabled:opacity-50 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Volver</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-1">Paso final</p>
          <h1 className="text-3xl font-bold text-white">Confirma tu reserva</h1>
          <p className="text-slate-400 mt-1">Revisa los detalles antes de pagar</p>
        </div>

        <div className="space-y-4">

          {/* 1. Property card — horizontal on desktop */}
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative sm:w-56 sm:flex-shrink-0 h-48 sm:h-auto">
                {unit?.image ? (
                  <>
                    <img src={unit.image} alt={unit.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/40 hidden sm:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent sm:hidden" />
                    {/* Mobile overlay text */}
                    <div className="absolute bottom-3 left-3 sm:hidden">
                      <p className="text-white font-bold text-lg">{unit.name}</p>
                      <p className="text-slate-300 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {unit.city}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                {/* Desktop title */}
                <div className="hidden sm:block mb-4">
                  <p className="text-white font-bold text-xl">{unit?.name}</p>
                  <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {unit?.city}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Check-in</p>
                    <p className="text-white font-semibold text-sm">{formatDate(checkIn)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Check-out</p>
                    <p className="text-white font-semibold text-sm">{formatDate(checkOut)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-emerald-300 text-sm font-medium">
                    {state.days} noche{state.days !== 1 ? 's' : ''} en total
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Price breakdown */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-white font-semibold mb-4">Resumen de pago</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Precio por noche</span>
                <span className="text-white text-sm font-medium">${fmt(pricePerDayConverted)} {currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">{state.days} noche{state.days !== 1 ? 's' : ''}</span>
                <span className="text-white text-sm font-medium">
                  ${fmt(convertPrice((state.basePricePerDay || state.pricePerDay) * state.days))} {currency}
                </span>
              </div>
              {state.discountPercentage && state.discountPercentage > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-sm">Descuento {state.discountPercentage}%</span>
                  <span className="text-emerald-400 text-sm font-medium">−${fmt(discountConverted)} {currency}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                <span className="text-white font-bold text-base">Total a pagar</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">${fmt(totalPriceConverted)}</p>
                  <p className="text-slate-500 text-xs">{currency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment methods */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Medios de pago</p>
            <div className="flex flex-wrap gap-1.5">
              {['Visa', 'Mastercard', 'Débito', 'WebPay', 'Transferencia'].map(m => (
                <span key={m} className="px-2 py-1 bg-slate-700 rounded-lg text-slate-300 text-xs font-medium border border-slate-600/50">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* 4. T&C */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => !isRedirecting && setTermsAccepted(!state.termsAccepted)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                  state.termsAccepted ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-700 border-slate-500 hover:border-emerald-500/50'
                }`}
              >
                {state.termsAccepted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-slate-300 text-sm leading-relaxed">
                Acepto los{' '}
                <Link href="/terminos-y-condiciones" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  términos y condiciones
                </Link>{' '}de Homested
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 5. CTA */}
          {isRedirecting ? (
            <div className="w-full py-4 bg-[#009ee3]/80 text-white font-semibold rounded-2xl flex items-center justify-center gap-3">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Redirigiendo a Mercado Pago...
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={!state.termsAccepted}
              className="w-full py-4 px-6 bg-[#009ee3] hover:bg-[#0082c0] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-[#009ee3]/20 hover:shadow-[#009ee3]/30 flex items-center justify-center gap-3"
            >
              <img
                src="https://vectorseek.com/wp-content/uploads/2023/08/Mercado-Pago-Logo-Vector.svg-1-1.png"
                alt="Mercado Pago"
                className="h-6 w-auto flex-shrink-0"
              />
              <div className="text-left">
                <p className="font-bold text-base leading-tight">Pagar ahora</p>
                <p className="text-white/70 text-xs">${fmt(totalPriceConverted)} {currency}</p>
              </div>
            </button>
          )}

          <p className="text-center text-slate-600 text-xs flex items-center justify-center gap-1.5 pb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Transacción 100% segura con cifrado SSL
          </p>
        </div>
      </div>
    </div>
  );
}
