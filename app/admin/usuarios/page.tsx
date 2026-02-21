'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '@/app/services/user.service';
import { getUserBookings } from '@/app/services/booking.service';

interface UserWithStats {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'user' | 'admin';
  created_at?: string;
  bookings_count?: number;
  total_spent?: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin', currentUserName: string) => {
    const label = newRole === 'admin' ? 'administrador' : 'usuario';
    if (!confirm(`¿Cambiar el rol de "${currentUserName}" a ${label}?`)) return;

    setUpdatingRole(userId);
    try {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        setUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
        );
        showToast(`Rol actualizado a ${label}`, 'success');
      } else {
        showToast('Error al actualizar el rol', 'error');
      }
    } catch {
      showToast('Error al actualizar el rol', 'error');
    } finally {
      setUpdatingRole(null);
    }
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalUsers = users.filter(u => u.role !== 'admin').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Cargando usuarios...</p>
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
        <h1 className="text-3xl font-bold text-white mb-2">Usuarios</h1>
        <p className="text-slate-400">Gestiona los usuarios registrados y sus roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-5">
          <p className="text-3xl font-bold text-white mb-1">{users.length}</p>
          <p className="text-blue-400 text-sm font-medium">Total usuarios</p>
        </div>
        <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20 rounded-xl p-5">
          <p className="text-3xl font-bold text-white mb-1">{totalUsers}</p>
          <p className="text-slate-400 text-sm font-medium">Clientes</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
          <p className="text-3xl font-bold text-white mb-1">{totalAdmins}</p>
          <p className="text-emerald-400 text-sm font-medium">Administradores</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'user', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                roleFilter === r
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {r === 'all' ? 'Todos' : r === 'admin' ? 'Admins' : 'Clientes'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-slate-400">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Registrado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Cambiar Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name || 'Sin nombre'}</p>
                          <p className="text-slate-500 text-xs font-mono">{user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 text-sm">{user.email}</p>
                      {user.phone && (
                        <p className="text-slate-500 text-xs">{user.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('es-CL', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-600/50 text-slate-300 border border-slate-600">
                          Cliente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {updatingRole === user.id ? (
                        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      ) : user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user.id, 'user', user.name || user.email)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-600/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-600 hover:border-red-500/30 transition-all"
                        >
                          Quitar admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user.id, 'admin', user.name || user.email)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-600 hover:border-emerald-500/30 transition-all"
                        >
                          Hacer admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-slate-600 text-xs mt-4 text-center">
        {filtered.length} de {users.length} usuarios
      </p>
    </div>
  );
}
