'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/shared/lib/supabase';

interface Payment {
  id: string;
  booking_id: string;
  mp_payment_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  amount_clp: number;
  payment_method: string | null;
  payment_method_type: string | null;
  error_message: string | null;
  created_at: string;
  booking: {
    days: number;
    check_in: string;
    check_out: string;
    property: { name: string } | null;
    user: { name: string; email: string } | null;
  } | null;
}

type FilterStatus = 'all' | 'approved' | 'pending' | 'rejected' | 'refunded';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { loadData(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id, booking_id, mp_payment_id, status, amount_clp,
          payment_method, payment_method_type, error_message, created_at,
          booking:bookings (
            days, check_in, check_out,
            property:properties ( name ),
            user:users ( name, email )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments((data as unknown as Payment[]) || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      showToast('Error al cargar pagos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.booking?.user?.name?.toLowerCase().includes(q) ||
        p.booking?.user?.email?.toLowerCase().includes(q) ||
        p.booking?.property?.name?.toLowerCase().includes(q) ||
        p.mp_payment_id?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Métricas
  const totalRevenue = payments.filter(p => p.status === 'approved').reduce((s, p) => s + p.amount_clp, 0);
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount_clp, 0);
  const refundedRevenue = payments.filter(p => p.status === 'refunded' || p.status === 'charged_back').reduce((s, p) => s + p.amount_clp, 0);
  const approvedCount = payments.filter(p => p.status === 'approved').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected' || p.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pagos</h1>
        <p className="text-slate-400">Seguimiento de todos los pagos de reservas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Ingresos aprobados</p>
          <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString('es-CL')}</p>
          <p className="text-slate-500 text-xs mt-1">CLP · {approvedCount} pagos</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-5">
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">Pendientes</p>
          <p className="text-2xl font-bold text-white">${pendingRevenue.toLocaleString('es-CL')}</p>
          <p className="text-slate-500 text-xs mt-1">CLP · {pendingCount} pagos</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-5">
          <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Rechazados</p>
          <p className="text-2xl font-bold text-white">{rejectedCount}</p>
          <p className="text-slate-500 text-xs mt-1">transacciones</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Reembolsados</p>
          <p className="text-2xl font-bold text-white">${refundedRevenue.toLocaleString('es-CL')}</p>
          <p className="text-slate-500 text-xs mt-1">CLP devuelto</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por usuario, propiedad, ID de MP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'approved', 'pending', 'rejected', 'refunded'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === s ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {s === 'all' ? 'Todos' : s === 'approved' ? 'Aprobados' : s === 'pending' ? 'Pendientes' : s === 'rejected' ? 'Rechazados' : 'Reembolsados'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400">No se encontraron pagos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">MP ID</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Propiedad</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Monto</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Método</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Fecha</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-slate-400 font-mono text-xs">
                        {payment.mp_payment_id ?? <span className="text-slate-600 italic">sin ID</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{payment.booking?.user?.name || '—'}</p>
                      <p className="text-slate-500 text-xs">{payment.booking?.user?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-300 text-sm">{payment.booking?.property?.name || '—'}</p>
                      <p className="text-slate-500 text-xs">{payment.booking?.days} día{payment.booking?.days !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-bold">${payment.amount_clp.toLocaleString('es-CL')}</p>
                      <p className="text-slate-500 text-xs">CLP</p>
                    </td>
                    <td className="px-5 py-4">
                      {payment.payment_method_type ? (
                        <span className="px-2 py-1 bg-slate-700 rounded text-slate-300 text-xs font-medium capitalize">
                          {payment.payment_method_type}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-400 text-sm">
                        {new Date(payment.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-600 text-xs">
                        {new Date(payment.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <PaymentStatusPill status={payment.status} />
                        {payment.error_message && (
                          <p className="text-red-400/70 text-xs mt-1 max-w-[160px] truncate" title={payment.error_message}>
                            {payment.error_message}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-slate-600 text-xs mt-4 text-center">
        {filtered.length} de {payments.length} transacciones
      </p>
    </div>
  );
}

function PaymentStatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending:      { label: 'Pendiente',    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    approved:     { label: 'Aprobado',     color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    rejected:     { label: 'Rechazado',    color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    cancelled:    { label: 'Cancelado',    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
    refunded:     { label: 'Reembolsado',  color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    charged_back: { label: 'Contracargo',  color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  };

  const { label, color } = config[status] || config.pending;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {label}
    </span>
  );
}
