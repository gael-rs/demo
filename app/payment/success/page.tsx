'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useBooking } from '@/app/context';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { restorePaymentResult } = useBooking();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('status');

    if (!paymentId || paymentStatus !== 'approved') {
      router.push('/');
      return;
    }

    const bookingState = (() => {
      try {
        const raw = sessionStorage.getItem('mp_pending_payment');
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();

    sessionStorage.removeItem('mp_pending_payment');

    let attempts = 0;
    const MAX_ATTEMPTS = 8;
    const INTERVAL_MS = 2000;

    const poll = async () => {
      attempts++;
      setAttempt(attempts);

      try {
        const res = await fetch(`/api/payment/confirm?payment_id=${paymentId}`);
        const { bookingId } = await res.json();

        if (bookingId) {
          sessionStorage.setItem(
            'mp_payment_result',
            JSON.stringify({ success: true, paymentId, bookingId, bookingState })
          );
          await restorePaymentResult();
          router.push('/');
          return;
        }
      } catch {
        // reintentar
      }

      if (attempts < MAX_ATTEMPTS) {
        setTimeout(poll, INTERVAL_MS);
      } else {
        sessionStorage.setItem(
          'mp_payment_result',
          JSON.stringify({ success: true, paymentId, bookingId: null, bookingState })
        );
        await restorePaymentResult();
        router.push('/');
      }
    };

    setTimeout(poll, INTERVAL_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min((attempt / 8) * 100, 90);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        {/* Icono animado */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">¡Pago exitoso!</h1>
        <p className="text-slate-400 mb-2">Tu pago fue aprobado por Mercado Pago.</p>
        <p className="text-slate-500 text-sm mb-8">Activando tu reserva, espera un momento...</p>

        {/* Barra de progreso */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-slate-600 text-xs">
          Verificando confirmación{'.'.repeat((attempt % 3) + 1)}
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
