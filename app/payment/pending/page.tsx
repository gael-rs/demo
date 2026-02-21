'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPendingPage() {
  const router = useRouter();

  useEffect(() => {
    // Pago pendiente (transferencia bancaria, etc.)
    const pending = sessionStorage.getItem('mp_pending_payment');
    if (pending) {
      const bookingState = JSON.parse(pending);
      sessionStorage.setItem(
        'mp_payment_result',
        JSON.stringify({
          success: false,
          pending: true,
          bookingState,
        })
      );
      sessionStorage.removeItem('mp_pending_payment');
    }

    const timer = setTimeout(() => {
      router.push('/');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pago en proceso</h1>
        <p className="text-slate-400 mb-2">Tu pago está siendo verificado.</p>
        <p className="text-slate-400 text-sm mb-6">Te notificaremos cuando se confirme.</p>
        <p className="text-slate-500 text-xs">Redirigiendo...</p>
      </div>
    </div>
  );
}
