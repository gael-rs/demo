'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/app/context';
import { getUserBookings } from '@/app/features/booking/booking.service';
import { getAccessCodeForBooking } from '@/app/features/access/accessCode.service';
import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';
import type { Booking } from '@/app/types';
import type { AccessCode } from '@/app/features/access/smartlock.service';

export default function MyBookingsPage() {
  const { authState, goToStep } = useBooking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [accessCodes, setAccessCodes] = useState<Record<string, AccessCode>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.user) {
      goToStep('auth');
      return;
    }

    const loadData = async () => {
      try {
        const data = await getUserBookings(authState.user!.id);
        setBookings(data);

        // Load access codes for confirmed/active bookings
        const confirmedBookings = data.filter(
          (b) => b.status === 'confirmed' || b.status === 'active'
        );

        const codes = await Promise.all(
          confirmedBookings.map((b) => getAccessCodeForBooking(b.id))
        );

        const codesMap: Record<string, AccessCode> = {};
        codes.forEach((code, index) => {
          if (code) {
            codesMap[confirmedBookings[index].id] = code;
          }
        });

        setAccessCodes(codesMap);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authState, goToStep]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Cargando reservas...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Mis Reservas</h1>

          {bookings.length === 0 ? (
            <EmptyState onExplore={() => goToStep('landing')} />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  accessCode={accessCodes[booking.id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="bg-slate-800 rounded-xl p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 text-slate-500">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">
        No tienes reservas aún
      </h2>
      <p className="text-slate-400 mb-6">
        Explora nuestras propiedades y haz tu primera reserva
      </p>
      <button
        onClick={onExplore}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
      >
        Explorar Propiedades
      </button>
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  accessCode?: AccessCode;
}

function BookingCard({ booking, accessCode }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {booking.property?.name || 'Propiedad'}
            </h3>
            <p className="text-slate-400 text-sm">
              {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
              <span className="ml-2">({booking.days} días)</span>
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-emerald-400 font-bold text-lg">
            ${booking.total_price_clp.toLocaleString()} CLP
          </p>
          <ChevronIcon expanded={expanded} />
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-slate-700 pt-4 space-y-4">
          {/* Property image */}
          {booking.property?.image && (
            <img
              src={booking.property.image}
              alt={booking.property.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Price breakdown */}
          {(booking.discount_percentage ?? 0) > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Desglose de Precio</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Precio base × {booking.days} días</span>
                  <span>
                    ${((booking.base_price_clp || 0) * booking.days).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento ({booking.discount_percentage}%)</span>
                  <span>-${(booking.discount_amount_clp || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-semibold pt-2 border-t border-slate-600">
                  <span>Total</span>
                  <span>${booking.total_price_clp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Access code */}
          {accessCode && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Código de Acceso
              </h4>
              <p className="text-4xl font-mono font-bold text-white tracking-widest mb-2">
                {accessCode.code}
              </p>
              <p className="text-slate-400 text-xs">
                Válido del {formatDate(accessCode.valid_from)} al{' '}
                {formatDate(accessCode.valid_until)}
              </p>
              {accessCode.lock_sync_status === 'simulated' && (
                <p className="text-yellow-400 text-xs mt-2 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Código simulado - contacta recepción para activar
                </p>
              )}
            </div>
          )}

          {/* Pending status */}
          {booking.status === 'pending' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2 text-yellow-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong>Verificación en proceso</strong>
                  <br />
                  Tu identidad está siendo revisada. Recibirás tu código una vez aprobada.
                </div>
              </div>
            </div>
          )}

          {/* Cancelled status */}
          {booking.status === 'cancelled' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Reserva Cancelada</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: 'Confirmada', color: 'bg-emerald-500/20 text-emerald-400' },
    active: { label: 'Activa', color: 'bg-blue-500/20 text-blue-400' },
    completed: { label: 'Completada', color: 'bg-slate-500/20 text-slate-400' },
    cancelled: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-6 h-6 text-slate-400 transition-transform ${
        expanded ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
