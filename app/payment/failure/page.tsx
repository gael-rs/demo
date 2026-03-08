'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/app/context';

export default function PaymentFailurePage() {
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

  const handleRetry = async () => {
    await restorePaymentResult();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        {/* Icono */}
        <div className="w-28 h-28 mx-auto mb-8 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <p className="text-red-400 text-sm font-medium tracking-wide uppercase mb-2">Pago rechazado</p>
        <h1 className="text-3xl font-bold text-white mb-3">No pudimos procesar tu pago</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Tu tarjeta no fue aceptada. Puedes intentar con otro medio de pago o verificar los datos ingresados.
        </p>

        {/* Sugerencias */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-8 text-left space-y-2">
          {[
            'Verifica que los datos de tu tarjeta sean correctos',
            'Asegúrate de tener fondos suficientes',
            'Intenta con otra tarjeta o medio de pago',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
              <p className="text-slate-400 text-xs">{tip}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3.5 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all mb-4"
        >
          Intentar de nuevo
        </button>

        <p className="text-slate-600 text-xs">
          Redirigiendo en {countdown}s...
        </p>
      </div>
    </div>
  );
}
