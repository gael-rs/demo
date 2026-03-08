'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/app/context';

export default function PaymentPendingPage() {
  const router = useRouter();
  const { restorePaymentResult } = useBooking();
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const pending = sessionStorage.getItem('mp_pending_payment');
    if (pending) {
      try {
        const bookingState = JSON.parse(pending);
        sessionStorage.setItem(
          'mp_payment_result',
          JSON.stringify({ success: false, pending: true, bookingState })
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
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse" />
          <div className="relative w-24 h-24 bg-yellow-500/15 rounded-full flex items-center justify-center border border-yellow-500/20">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Pago en revisión</h1>
        <p className="text-slate-400 mb-2">Tu pago está siendo verificado.</p>
        <p className="text-slate-500 text-sm mb-2">
          Esto puede tomar unos minutos. Te notificaremos por email cuando se confirme.
        </p>

        {/* Info badge */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-8">
          <p className="text-yellow-300 text-xs">
            No es necesario que esperes aquí. Una vez confirmado el pago, podrás continuar con tu reserva.
          </p>
        </div>

        <button
          onClick={async () => {
            await restorePaymentResult();
            router.push('/');
          }}
          className="w-full py-3.5 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all mb-4"
        >
          Volver al inicio
        </button>

        <p className="text-slate-600 text-xs">
          Redirigiendo en {countdown}s...
        </p>
      </div>
    </div>
  );
}
