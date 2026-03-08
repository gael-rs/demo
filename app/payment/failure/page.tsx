'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/app/context';

export default function PaymentFailurePage() {
  const router = useRouter();
  const { restorePaymentResult } = useBooking();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const pending = sessionStorage.getItem('mp_pending_payment');
    if (pending) {
      try {
        const bookingState = JSON.parse(pending);
        sessionStorage.setItem(
          'mp_payment_result',
          JSON.stringify({ success: false, bookingState })
        );
        sessionStorage.removeItem('mp_pending_payment');
      } catch { /* ignorar */ }
    }

    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          restorePaymentResult().then(() => router.push('/'));
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        {/* Icono */}
        <div className="w-24 h-24 mx-auto mb-8 bg-red-500/15 rounded-full flex items-center justify-center border border-red-500/20">
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Pago rechazado</h1>
        <p className="text-slate-400 mb-2">No pudimos procesar tu pago.</p>
        <p className="text-slate-500 text-sm mb-8">
          Puedes intentar con otro medio de pago.
        </p>

        {/* Botón reintentar */}
        <button
          onClick={async () => {
            await restorePaymentResult();
            router.push('/');
          }}
          className="w-full py-3.5 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all mb-4"
        >
          Intentar de nuevo
        </button>

        <p className="text-slate-600 text-xs">
          Volviendo automáticamente en {countdown}s...
        </p>
      </div>
    </div>
  );
}
