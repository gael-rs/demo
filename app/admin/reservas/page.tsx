'use client';

import { useEffect, useState } from 'react';
import { getAllBookings } from '@/app/features/booking/booking.service';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.property?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Gestión de Reservas</h1>
        <p className="text-slate-400">{bookings.length} reserva{bookings.length !== 1 ? 's' : ''} en total</p>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por usuario o propiedad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
        />
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'active', label: 'Activa' },
            { value: 'completed', label: 'Completada' },
            { value: 'cancelled', label: 'Cancelada' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === value ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista accordion */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400">No se encontraron reservas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookings.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              expanded={expandedId === booking.id}
              onToggle={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingRow({
  booking,
  expanded,
  onToggle,
}: {
  booking: any;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
      {/* Header siempre visible */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/40 transition-colors text-left"
      >
        <div className="flex items-center gap-6 min-w-0">
          {/* Usuario */}
          <div className="min-w-0 w-52 flex-shrink-0">
            <p className="text-white font-medium truncate">{booking.user?.name || '—'}</p>
            <p className="text-slate-400 text-xs truncate">{booking.user?.email}</p>
          </div>

          {/* Propiedad */}
          <div className="min-w-0 flex-1">
            <p className="text-slate-300 text-sm truncate">{booking.property?.name || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <StatusPill status={booking.status} />
          {booking.identity_verified ? (
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 font-medium">
              ID verificada
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-500 font-medium">
              Sin verificar
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Detalle expandible */}
      {expanded && (
        <div className="border-t border-slate-700/50 px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Check-in</p>
              <p className="text-white text-sm font-medium">
                {new Date(booking.check_in).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Check-out</p>
              <p className="text-white text-sm font-medium">
                {new Date(booking.check_out).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Días</p>
              <p className="text-white text-sm font-medium">{booking.days} día{booking.days !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Total</p>
              <p className="text-emerald-400 text-sm font-bold">${booking.total_price_clp?.toLocaleString('es-CL')} CLP</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Estado de pago</p>
              <p className="text-white text-sm">{booking.payment_status === 'completed' ? '✓ Completado' : booking.payment_status}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">ID Reserva</p>
              <p className="text-slate-400 font-mono text-xs">{booking.id.substring(0, 16)}...</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Creada</p>
              <p className="text-slate-400 text-xs">
                {new Date(booking.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pendiente',  color: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400' },
    active:    { label: 'Activa',     color: 'bg-emerald-500/20 text-emerald-400' },
    completed: { label: 'Completada', color: 'bg-purple-500/20 text-purple-400' },
    cancelled: { label: 'Cancelada',  color: 'bg-red-500/20 text-red-400' },
  };
  const { label, color } = config[status] || config.pending;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
}
