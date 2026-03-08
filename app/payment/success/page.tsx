'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusMsg, setStatusMsg] = useState('Confirmando tu pago...');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('status');

    if (!paymentId || paymentStatus !== 'approved') {
      // Pago no aprobado — redirigir a inicio
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

    // Polling: esperar a que el webhook cree la reserva
    let attempts = 0;
    const MAX_ATTEMPTS = 8;
    const INTERVAL_MS = 2000;

    const poll = async () => {
      attempts++;
      setStatusMsg(`Activando tu reserva${'.'.repeat(attempts % 4)}`);

      try {
        const res = await fetch(`/api/payment/confirm?payment_id=${paymentId}`);
        const { bookingId } = await res.json();

        if (bookingId) {
          // Reserva creada — guardar resultado y redirigir
          sessionStorage.setItem(
            'mp_payment_result',
            JSON.stringify({
              success: true,
              paymentId,
              bookingId,
              bookingState,
            })
          );
          router.push('/');
          return;
        }
      } catch {
        // ignorar errores de red y reintentar
      }

      if (attempts < MAX_ATTEMPTS) {
        setTimeout(poll, INTERVAL_MS);
      } else {
        // Timeout: redirigir igual, el contexto mostrará estado apropiado
        sessionStorage.setItem(
          'mp_payment_result',
          JSON.stringify({
            success: true,
            paymentId,
            bookingId: null,
            bookingState,
          })
        );
        router.push('/');
      }
    };

    setTimeout(poll, INTERVAL_MS);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">¡Pago exitoso!</h1>
        <p className="text-slate-400 mb-6">{statusMsg}</p>
        <div className="w-full bg-slate-800 rounded-full h-1">
          <div className="bg-emerald-500 h-1 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
