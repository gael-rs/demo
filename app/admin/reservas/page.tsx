'use client';

import { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '@/app/features/booking/booking.service';
import { getAccessCodeForBooking, deleteAccessCodeByBookingId } from '@/app/features/access/accessCode.service';
import { deleteVerificationDocuments, deleteVerificationByBookingId } from '@/app/features/identity/verification.service';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; userId: string; name: string } | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus as any);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      showToast('Estado actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error al actualizar el estado', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId: string, userId: string) => {
    setDeletingId(bookingId);
    try {
      await deleteVerificationDocuments(userId, bookingId);
      await deleteVerificationByBookingId(bookingId);
      await deleteAccessCodeByBookingId(bookingId);
      await deleteBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      showToast('Reserva eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast('Error al eliminar la reserva', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleViewAccessCode = async (bookingId: string) => {
    try {
      const accessCode = await getAccessCodeForBooking(bookingId);
      if (accessCode) {
        alert(`Código de acceso: ${accessCode.code}\n\nVálido desde: ${new Date(accessCode.valid_from).toLocaleString()}\nVálido hasta: ${new Date(accessCode.valid_until).toLocaleString()}`);
      } else {
        alert('No hay código de acceso generado para esta reserva');
      }
    } catch (error) {
      console.error('Error fetching access code:', error);
      alert('Error al obtener el código de acceso');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter !== 'all' && booking.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        booking.user?.name?.toLowerCase().includes(searchLower) ||
        booking.user?.email?.toLowerCase().includes(searchLower) ||
        booking.property?.name?.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower)
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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Eliminar reserva</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              ¿Eliminar la reserva de <strong className="text-white">{confirmDelete.name}</strong>? Se eliminarán todos los datos asociados. Esta acción no puede deshacerse.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteBooking(confirmDelete.id, confirmDelete.userId)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 disabled:bg-red-500/50 text-white rounded-lg font-medium transition-colors"
              >
                {deletingId === confirmDelete.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-white mb-8">Gestión de Reservas</h1>

      {/* Filters and search */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por usuario, propiedad o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No se encontraron reservas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Propiedad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Fechas</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Días</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Verificado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{booking.user?.name}</p>
                        <p className="text-slate-400 text-sm">{booking.user?.email}</p>
                      </div>
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
                      <p className="text-white">{booking.days}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">
                        ${booking.total_price_clp.toLocaleString()} CLP
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      {booking.identity_verified ? (
                        <span className="text-green-400">✓ Sí</span>
                      ) : (
                        <span className="text-slate-500">✗ No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-xs bg-slate-700 text-white border border-slate-600 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="active">Activa</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                        <button
                          onClick={() => handleViewAccessCode(booking.id)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="Ver código de acceso"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: booking.id, userId: booking.user_id, name: booking.user?.name || booking.user?.email || 'Usuario' })}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Eliminar reserva"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-gray-500/20 text-gray-400' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400' },
    active: { label: 'Activa', color: 'bg-green-500/20 text-green-400' },
    completed: { label: 'Completada', color: 'bg-purple-500/20 text-purple-400' },
    cancelled: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}
