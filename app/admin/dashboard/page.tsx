'use client';

import { useEffect, useState } from 'react';
import { getBookingMetrics, getAllBookings } from '@/app/features/booking/booking.service';
import { getPendingVerifications } from '@/app/features/identity/verification.service';
import { getAllUsers } from '@/app/features/admin/user.service';
import Link from 'next/link';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, bookingsData, pendingData, usersData] = await Promise.all([
        getBookingMetrics(),
        getAllBookings(),
        getPendingVerifications(),
        getAllUsers(),
      ]);

      setMetrics(metricsData);
      setRecentBookings(bookingsData.slice(0, 6));
      setPendingCount(pendingData.length);
      setTotalUsers(usersData.length);
      setPendingPayments(bookingsData.filter((b: any) => b.payment_status === 'pending').length);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
          <p className="text-slate-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Vista general de la plataforma Homested</p>
      </div>

      {/* Alertas */}
      <div className="space-y-3 mb-6">
        {pendingCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-yellow-400 font-semibold">
                  {pendingCount} verificación{pendingCount !== 1 ? 'es' : ''} biométrica{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}
                </p>
                <p className="text-slate-400 text-sm">Requieren revisión manual para confirmar reservas.</p>
              </div>
              <Link href="/admin/verificaciones" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm flex-shrink-0">
                Revisar
              </Link>
            </div>
          </div>
        )}
        {pendingPayments > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-blue-400 font-semibold">
                  {pendingPayments} pago{pendingPayments !== 1 ? 's' : ''} pendiente{pendingPayments !== 1 ? 's' : ''}
                </p>
                <p className="text-slate-400 text-sm">Pagos aún no confirmados por MercadoPago.</p>
              </div>
              <Link href="/admin/pagos" className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-sm flex-shrink-0">
                Ver pagos
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Ingresos del mes"
          value={`$${(metrics?.revenue_this_month || 0).toLocaleString('es-CL')}`}
          subtitle="CLP"
          icon={<RevenueIcon />}
          color="emerald"
          trend={null}
        />
        <StatCard
          title="Ingresos totales"
          value={`$${(metrics?.revenue_total || 0).toLocaleString('es-CL')}`}
          subtitle="CLP acumulado"
          icon={<TotalRevenueIcon />}
          color="blue"
          trend={null}
        />
        <StatCard
          title="Reservas totales"
          value={metrics?.total || 0}
          icon={<BookingIcon />}
          color="purple"
          trend={null}
        />
        <StatCard
          title="Usuarios registrados"
          value={totalUsers}
          icon={<UsersIcon />}
          color="orange"
          link="/admin/usuarios"
          trend={null}
        />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Activas" value={metrics?.active || 0} icon={<ActiveIcon />} color="green" trend={null} />
        <StatCard title="Confirmadas" value={metrics?.confirmed || 0} icon={<ConfirmedIcon />} color="blue" trend={null} />
        <StatCard title="Verificaciones pendientes" value={pendingCount} icon={<ClockIcon />} color="yellow" link="/admin/verificaciones" trend={null} />
        <StatCard title="Canceladas" value={metrics?.cancelled || 0} icon={<CancelIcon />} color="red" trend={null} />
      </div>

      {/* Bottom grid: estado de reservas + últimas reservas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Estado de reservas */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Estado de Reservas</h2>
          <div className="space-y-3">
            {[
              { label: 'Pendientes',  count: metrics?.pending || 0,   color: 'bg-slate-500', text: 'text-slate-300' },
              { label: 'Confirmadas', count: metrics?.confirmed || 0,  color: 'bg-blue-500',  text: 'text-blue-400' },
              { label: 'Activas',     count: metrics?.active || 0,     color: 'bg-green-500', text: 'text-green-400' },
              { label: 'Completadas', count: metrics?.completed || 0,  color: 'bg-purple-500',text: 'text-purple-400' },
              { label: 'Canceladas',  count: metrics?.cancelled || 0,  color: 'bg-red-500',   text: 'text-red-400' },
            ].map(({ label, count, color, text }) => {
              const total = metrics?.total || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={text}>{label}</span>
                    <span className="text-slate-400">{count} <span className="text-slate-600 text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Últimas Reservas</h2>
            <Link href="/admin/reservas" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1">
              Ver todas
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-14 h-14 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400">No hay reservas todavía</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 font-bold text-sm">
                        {(booking.user?.name || booking.user?.email || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{booking.user?.name || booking.user?.email}</p>
                      <p className="text-slate-400 text-xs truncate">
                        {booking.property?.name} · {booking.days} día{booking.days !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">
                        ${booking.total_price_clp.toLocaleString('es-CL')}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {new Date(booking.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <StatusPill status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────
function RevenueIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function TotalRevenueIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}
function BookingIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function UsersIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function ActiveIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function ConfirmedIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
function ClockIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function CancelIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

// ─── Components ───────────────────────────────────
function StatCard({
  title, value, subtitle, icon, color, link, trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  link?: string;
  trend?: number | null;
}) {
  const palette: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: 'from-emerald-500/10 to-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    blue:    { bg: 'from-blue-500/10 to-blue-600/10',       border: 'border-blue-500/20',    text: 'text-blue-400' },
    purple:  { bg: 'from-purple-500/10 to-purple-600/10',   border: 'border-purple-500/20',  text: 'text-purple-400' },
    orange:  { bg: 'from-orange-500/10 to-orange-600/10',   border: 'border-orange-500/20',  text: 'text-orange-400' },
    green:   { bg: 'from-green-500/10 to-green-600/10',     border: 'border-green-500/20',   text: 'text-green-400' },
    yellow:  { bg: 'from-yellow-500/10 to-yellow-600/10',   border: 'border-yellow-500/20',  text: 'text-yellow-400' },
    red:     { bg: 'from-red-500/10 to-red-600/10',         border: 'border-red-500/20',     text: 'text-red-400' },
  };

  const p = palette[color] || palette.blue;

  const content = (
    <div className={`bg-gradient-to-br ${p.bg} border ${p.border} rounded-xl p-5 ${link ? 'cursor-pointer hover:scale-[1.02]' : ''} transition-all h-full`}>
      <div className={`${p.text} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      {subtitle && <p className="text-slate-500 text-xs mb-0.5">{subtitle}</p>}
      <p className="text-slate-300 text-sm font-medium">{title}</p>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pendiente',  color: 'bg-gray-500/20 text-gray-300 border border-gray-500/30' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    active:    { label: 'Activa',     color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    completed: { label: 'Completada', color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    cancelled: { label: 'Cancelada',  color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  };
  const { label, color } = cfg[status] || cfg.pending;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${color}`}>
      {label}
    </span>
  );
}
