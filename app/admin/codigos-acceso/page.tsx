'use client';

import { useEffect, useState } from 'react';
import { getAllBookings, getBookingById, updateBookingStatus } from '@/app/features/booking/booking.service';
import { getAllAccessCodes } from '@/app/features/access/accessCode.service';
import { generateAccessCodeWithLock } from '@/app/features/access/smartlock.service';

export default function AccessCodesPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [codesMap, setCodesMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allBookings, allCodes] = await Promise.all([
        getAllBookings(),
        getAllAccessCodes(),
      ]);

      // Filtrar: solo reservas que no están canceladas
      const filtered = allBookings.filter((b: any) => b.status !== 'cancelled');
      setBookings(filtered);

      // Construir mapa bookingId → código
      const map: Record<string, any> = {};
      allCodes.forEach((c: any) => {
        map[c.booking_id] = c;
      });
      setCodesMap(map);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async (bookingId: string) => {
    if (!confirm('¿Generar llave virtual para esta reserva?')) return;
    setGeneratingId(bookingId);
    try {
      const booking = await getBookingById(bookingId);
      if (!booking) throw new Error('Reserva no encontrada');

      await generateAccessCodeWithLock(bookingId, booking.property_id, booking.check_in, booking.check_out);
      await updateBookingStatus(bookingId, 'active');

      alert('Llave virtual generada. La reserva está activa.');
      await loadData();
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error al generar la llave virtual');
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Códigos de Acceso</h1>

      {bookings.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No hay reservas</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Propiedad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Fechas</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Identidad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Código / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {bookings.map((booking: any) => {
                  const code = codesMap[booking.id];
                  const isVerified = booking.identity_verified;
                  const canGenerate = isVerified && !code;

                  return (
                    <tr key={booking.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{booking.user?.name}</p>
                        <p className="text-slate-400 text-sm">{booking.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{booking.property?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-white">{new Date(booking.check_in).toLocaleDateString()}</p>
                          <p className="text-slate-400">{new Date(booking.check_out).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <IdentityBadge verified={isVerified} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        {code ? (
                          <p className="text-emerald-300 font-mono font-bold text-lg">{code.code}</p>
                        ) : canGenerate ? (
                          <button
                            onClick={() => handleGenerateCode(booking.id)}
                            disabled={generatingId === booking.id}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
                          >
                            {generatingId === booking.id ? 'Generando...' : '🔑 Generar llave virtual'}
                          </button>
                        ) : (
                          <span className="text-slate-500 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function IdentityBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
        Validada de identidad
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-600/40 text-slate-400">
      No validada de identidad
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-gray-500/20 text-gray-400' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400' },
    active: { label: 'Activa', color: 'bg-green-500/20 text-green-400' },
    completed: { label: 'Completada', color: 'bg-purple-500/20 text-purple-400' },
  };

  const c = config[status] || config.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>
      {c.label}
    </span>
  );
}
