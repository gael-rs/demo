'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBooking } from '@/app/context';

export default function Payment() {
  const { state, goToStep, currency, convertPrice, authState, setTermsAccepted, createBookingForPayment } = useBooking();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert prices
  const pricePerDayConverted = convertPrice(state.pricePerDay);
  const totalPriceConverted = convertPrice(state.totalPrice);

  const handlePayment = async () => {
    if (!state.termsAccepted) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (!authState.user) {
      goToStep('auth');
      return;
    }

    setIsRedirecting(true);
    setError(null);

    try {
      // 1. Crear el booking en la DB con payment_status: 'pending'
      const bookingId = await createBookingForPayment();
      if (!bookingId) {
        throw new Error('No se pudo crear la reserva');
      }

      const checkIn = state.checkInDate || new Date();
      const checkOut = state.checkOutDate || (() => {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + state.days);
        return d;
      })();

      // 2. Guardar estado en sessionStorage antes de redirigir
      sessionStorage.setItem(
        'mp_pending_payment',
        JSON.stringify({
          bookingId,
          unitId: state.selectedUnit?.id,
          unitName: state.selectedUnit?.name,
          days: state.days,
          totalPrice: state.totalPrice,
          pricePerDay: state.pricePerDay,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          basePricePerDay: state.basePricePerDay,
          discountPercentage: state.discountPercentage,
          discountAmount: state.discountAmount,
        })
      );

      // 3. Crear preferencia en MercadoPago
      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          unitName: state.selectedUnit?.name,
          days: state.days,
          totalPriceCLP: state.totalPrice,
          checkIn: checkIn.toLocaleDateString('es-CL'),
          checkOut: checkOut.toLocaleDateString('es-CL'),
          userEmail: authState.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con MercadoPago');
      }

      const { initPoint, sandboxInitPoint } = await response.json();

      // 4. Redirigir al checkout de MercadoPago
      // En desarrollo usa sandboxInitPoint, en producción usa initPoint
      const checkoutUrl = process.env.NODE_ENV === 'production' ? initPoint : (sandboxInitPoint || initPoint);
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar el pago');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => goToStep('days-selection')}
          disabled={isRedirecting}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">Pago</h1>
        <p className="text-slate-400 mb-8">Completa tu reservación</p>

        {/* Resumen de reserva */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">{state.selectedUnit?.name}</p>
              <p className="text-slate-400 text-sm">{state.days} día{state.days !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Precio por día</span>
              <span className="text-white">
                ${pricePerDayConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
              </span>
            </div>
            {state.discountPercentage && state.discountPercentage > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Descuento ({state.discountPercentage}%)</span>
                <span>-${convertPrice(state.discountAmount || 0).toLocaleString('es-CL')} {currency}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Días</span>
              <span className="text-white">{state.days}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-700">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${totalPriceConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-medium">Error al procesar</p>
                <p className="text-slate-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Métodos de pago disponibles */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-sm font-medium mb-3">Métodos de pago aceptados</p>
          <div className="flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'Débito', 'WebPay', 'Transferencia'].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 bg-slate-700 rounded-md text-slate-300 text-xs font-medium"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pago seguro con MercadoPago
          </p>
        </div>

        {/* Términos y condiciones */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={isRedirecting}
              className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="text-slate-300 text-sm leading-relaxed">
              Acepto los{' '}
              <Link
                href="/terminos-y-condiciones"
                target="_blank"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                términos y condiciones
              </Link>
              {' '}de Homested
            </span>
          </label>
        </div>

        {/* Botón de pago */}
        {isRedirecting ? (
          <div className="w-full py-4 px-8 bg-slate-700 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Redirigiendo a MercadoPago...
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={!state.termsAccepted}
            className="w-full py-4 px-8 bg-[#009ee3] hover:bg-[#0088cc] text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#009ee3]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#009ee3] flex items-center justify-center gap-3"
          >
            {/* Logo MercadoPago */}
            <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" fill="white" fillOpacity="0.2"/>
              <path d="M8.5 24c0 2.2.4 4.2 1.2 6.1L16 24l-6.3-6.1C9 19.8 8.5 21.8 8.5 24zM24 39.5c2.2 0 4.2-.4 6.1-1.2L24 32l-6.1 6.3c1.9.8 3.9 1.2 6.1 1.2zM39.5 24c0-2.2-.4-4.2-1.2-6.1L32 24l6.3 6.1c.8-1.9 1.2-3.9 1.2-6.1zM24 8.5c-2.2 0-4.2.4-6.1 1.2L24 16l6.1-6.3C28.2 8.9 26.2 8.5 24 8.5z" fill="white"/>
            </svg>
            Pagar ${totalPriceConverted.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
          </button>
        )}

        <p className="text-center text-slate-500 text-xs mt-4">
          Serás redirigido al sitio seguro de MercadoPago
        </p>
      </div>
    </div>
  );
}
