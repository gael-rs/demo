'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/app/context';

export default function PaymentPendingPage() {
  const router = useRouter();
  const { restorePaymentResult } = useBooking();
  const [countdown, setCountdown] = useState(8);

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
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse" />
          <div className="relative w-28 h-28 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
            <svg className="w-14 h-14 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <p className="text-yellow-400 text-sm font-medium tracking-wide uppercase mb-2">Pago pendiente</p>
        <h1 className="text-3xl font-bold text-white mb-3">Tu pago está en revisión</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Mercado Pago está verificando tu transacción. Este proceso puede tomar algunos minutos.
        </p>

        {/* Info */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-yellow-200/70 text-xs leading-relaxed">
              No necesitas esperar aquí. Una vez que el pago sea confirmado por Mercado Pago, podrás continuar con tu reserva desde el inicio.
            </p>
          </div>
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
