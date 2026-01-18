'use client';

import { useBooking } from '../context';

export default function AccessGranted() {
  const { state, goToStep, simulateExpiration } = useBooking();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getAccessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour < 22) {
      return { status: 'active', text: 'Acceso activo', subtext: '6:00 - 22:00' };
    }
    return { status: 'restricted', text: 'Horario restringido', subtext: 'Acceso limitado' };
  };

  const accessStatus = getAccessHours();

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso habilitado</h1>
          <p className="text-slate-400">Ya puedes entrar a tu espacio</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-2">Tu código de acceso</p>
            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-4xl font-mono font-bold text-emerald-400 tracking-widest">
                {state.accessCode}
              </p>
            </div>
            <p className="text-slate-500 text-xs mt-2">Ingresa este código en la cerradura digital</p>
          </div>

          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-6 ${
            accessStatus.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-amber-500/10 text-amber-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              accessStatus.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
            } animate-pulse`} />
            <span className="font-medium">{accessStatus.text}</span>
            <span className="text-slate-400">({accessStatus.subtext})</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Inmueble</span>
              <span className="text-white font-medium">{state.selectedUnit?.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Check-in</span>
              <span className="text-white">{formatDate(state.checkInDate)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Check-out</span>
              <span className="text-white">{formatDate(state.checkOutDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Días restantes</span>
              <span className="text-emerald-400 font-bold">{state.daysRemaining} días</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">¿Necesitas más tiempo?</p>
              <p className="text-slate-400 text-sm">Extiende tu estadía y obtén mejor precio por día.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => goToStep('extend-stay')}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Extender estadía
          </button>

          <button
            onClick={simulateExpiration}
            className="w-full py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all border border-slate-700"
          >
            Simular expiración
          </button>
        </div>

      </div>
    </div>
  );
}
