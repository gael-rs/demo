'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useBooking } from '@/app/context';
import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';

type Phase = 'confirming' | 'ready';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { restorePaymentResult } = useBooking();

  const [phase, setPhase] = useState<Phase>('confirming');
  const [pollAttempt, setPollAttempt] = useState(0);
  const [countdown, setCountdown] = useState(30);

  // Fase 1: confirmar pago mediante polling
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

    const confirm = (bookingId: string | null) => {
      sessionStorage.setItem(
        'mp_payment_result',
        JSON.stringify({ success: true, paymentId, bookingId, bookingState })
      );
      setPhase('ready');
    };

    const poll = async () => {
      attempts++;
      setPollAttempt(attempts);
      try {
        const res = await fetch(`/api/payment/confirm?payment_id=${paymentId}`);
        const { bookingId } = await res.json();
        if (bookingId) { confirm(bookingId); return; }
      } catch { /* reintentar */ }

      if (attempts < MAX_ATTEMPTS) {
        setTimeout(poll, INTERVAL_MS);
      } else {
        confirm(null);
      }
    };

    setTimeout(poll, INTERVAL_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fase 2: countdown 5s → redirigir a identity-verification
  useEffect(() => {
    if (phase !== 'ready') return;

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
  }, [phase]);

  // ─── Pantalla: confirmando pago ───────────────────────────────────────────
  if (phase === 'confirming') {
    const progress = Math.min((pollAttempt / 8) * 85, 85);
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 pt-20">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">Confirmando tu pago</h2>
            <p className="text-slate-500 text-sm mb-8">Estamos verificando la transacción con Mercado Pago...</p>
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-1 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Pantalla: pago validado + countdown ─────────────────────────────────
  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm text-center">

        {/* Icono check */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-28 h-28 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <svg className="w-14 h-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="mb-8">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-2">Pago aprobado</p>
          <h1 className="text-3xl font-bold text-white mb-3">¡Tu reserva está confirmada!</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tu pago fue procesado exitosamente. Recibirás un resumen por correo electrónico cuando el servicio de notificaciones esté activo.
          </p>
        </div>

        {/* Siguiente paso */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">Siguiente paso</p>
              <p className="text-slate-400 text-xs">Validación biométrica</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-left leading-relaxed">
            Para garantizar tu seguridad y la del inmueble, necesitamos verificar tu identidad con un documento y una selfie.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">{countdown}</span>
          </div>
          <p className="text-slate-400 text-sm">segundos para continuar</p>
        </div>

        <button
          onClick={async () => {
            await restorePaymentResult();
            router.push('/');
          }}
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl transition-all text-sm"
        >
          Continuar ahora →
        </button>
      </div>
      </div>
      <Footer />
    </>
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
