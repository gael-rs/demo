'use client';

import { useState } from 'react';
import { useBooking } from '../context';

export default function IdentityVerification() {
  const { state, verifyIdentity } = useBooking();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    await verifyIdentity();
    setIsVerifying(false);
  };

  const handleRetry = () => {
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 text-emerald-400 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Pago completado</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Verifica tu identidad</h1>
        <p className="text-slate-400 mb-8">Último paso para habilitar tu acceso</p>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">
              Validación facial simulada
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Foto de tu rostro</p>
                <p className="text-slate-400 text-xs">Selfie frontal bien iluminada</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Documento de identidad</p>
                <p className="text-slate-400 text-xs">INE, pasaporte o licencia</p>
              </div>
            </div>
          </div>
        </div>

        {state.identityStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-medium">Verificación fallida</p>
                <p className="text-slate-400 text-sm">No pudimos verificar tu identidad. Intenta de nuevo.</p>
              </div>
            </div>
          </div>
        )}

        {isVerifying || state.identityStatus === 'verifying' ? (
          <div className="w-full py-4 px-8 bg-slate-700 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verificando identidad...
          </div>
        ) : state.identityStatus === 'failed' ? (
          <button
            onClick={handleRetry}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98]"
          >
            Reintentar verificación
          </button>
        ) : (
          <button
            onClick={handleVerify}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Iniciar verificación
          </button>
        )}

      </div>
    </div>
  );
}
