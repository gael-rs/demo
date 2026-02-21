'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentFailurePage() {
  const router = useRouter();

  useEffect(() => {
    // Guardar resultado fallido en sessionStorage
    const pending = sessionStorage.getItem('mp_pending_payment');
    if (pending) {
      const bookingState = JSON.parse(pending);
      sessionStorage.setItem(
        'mp_payment_result',
        JSON.stringify({
          success: false,
          bookingState,
        })
      );
      sessionStorage.removeItem('mp_pending_payment');
    }

    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pago fallido</h1>
        <p className="text-slate-400 mb-2">El pago no pudo procesarse.</p>
        <p className="text-slate-500 text-sm">Redirigiendo para intentar de nuevo...</p>
      </div>
    </div>
  );
}
