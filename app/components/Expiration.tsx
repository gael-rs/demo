'use client';

import { useBooking } from '../context';

export default function Expiration() {
  const { state, reset, goToStep } = useBooking();

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tu estadía ha terminado</h1>
          <p className="text-slate-400">El acceso al inmueble ha expirado</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-400 font-medium">Acceso deshabilitado</p>
                <p className="text-slate-400 text-sm">
                  El código de acceso ya no es válido. Por favor, desocupa el inmueble.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Inmueble</span>
              <span className="text-white">{state.selectedUnit?.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Duración</span>
              <span className="text-white">{state.days} días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total pagado</span>
              <span className="text-white font-semibold">${state.totalPrice.toLocaleString()} MXN</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <p className="text-white text-sm font-medium mb-2">¿Te gustaría quedarte más tiempo?</p>
          <p className="text-slate-400 text-sm">
            Puedes reservar una nueva estadía cuando quieras. Recuerda: entre más días, mejor precio.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              reset();
              goToStep('unit-selection');
            }}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Reservar de nuevo
          </button>

          <button
            onClick={reset}
            className="w-full py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all border border-slate-700"
          >
            Volver al inicio
          </button>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Gracias por usar Homested — Estado simulado para demo
        </p>
      </div>
    </div>
  );
}
