'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    // Guardar resultado en sessionStorage para que el contexto lo detecte
    if (paymentId && paymentStatus === 'approved') {
      const pending = sessionStorage.getItem('mp_pending_payment');
      if (pending) {
        const bookingState = JSON.parse(pending);
        sessionStorage.setItem(
          'mp_payment_result',
          JSON.stringify({
            success: true,
            paymentId,
            bookingId: externalReference || bookingState.bookingId,
            bookingState,
          })
        );
        sessionStorage.removeItem('mp_pending_payment');
      }
    }

    setStatus('done');

    // Redirigir al home después de un breve momento
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {status === 'loading' ? (
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">¡Pago exitoso!</h1>
            <p className="text-slate-400 mb-6">Tu pago fue procesado correctamente.</p>
            <p className="text-slate-500 text-sm">Redirigiendo para continuar tu reserva...</p>
            <div className="mt-4 w-full bg-slate-800 rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </>
        )}
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
