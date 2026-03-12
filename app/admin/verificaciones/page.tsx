'use client';

import { useEffect, useState } from 'react';
import {
  getAllVerifications,
  rejectVerification,
} from '@/app/features/identity/verification.service';
import ImageViewer from '@/app/features/admin/components/ImageViewer';
import { supabase } from '@/app/shared/lib/supabase';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [allVerifications, setAllVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ verificationId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadCurrentUser();
    loadVerifications();
  }, []);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const data = await getAllVerifications();
      setAllVerifications(data);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayed = filter === 'pending'
    ? allVerifications.filter(v => v.status === 'pending')
    : allVerifications;

  const pendingCount = allVerifications.filter(v => v.status === 'pending').length;

  const handleApprove = async (verificationId: string, bookingId: string) => {
    if (!currentUser) { showToast('Error: Usuario no autenticado', 'error'); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { showToast('Sesión expirada, recarga la página', 'error'); return; }

      const response = await fetch('/api/admin/approve-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ verificationId, bookingId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error del servidor');
      }

      showToast('Verificación aprobada y código de acceso generado', 'success');
      await loadVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      showToast(`Error al aprobar: ${error instanceof Error ? error.message : 'desconocido'}`, 'error');
    }
  };

  const handleRejectConfirm = async () => {
    if (!currentUser || !rejectModal) return;
    try {
      await rejectVerification(rejectModal.verificationId, currentUser.id, rejectReason || 'Sin especificar');
      showToast('Verificación rechazada', 'success');
      setRejectModal(null);
      setRejectReason('');
      await loadVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      showToast('Error al rechazar la verificación', 'error');
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
          <p className="text-slate-400">Cargando verificaciones...</p>
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

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Rechazar verificación</h3>
            <p className="text-slate-400 text-sm mb-4">Indica el motivo del rechazo (opcional):</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: Foto borrosa, documento ilegible..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-lg font-medium transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Verificaciones de Identidad</h1>
        <p className="text-slate-400">{allVerifications.length} total · {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Todas ({allVerifications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 ${
            filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Pendientes
          {pendingCount > 0 && (
            <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">
            {filter === 'pending' ? 'No hay verificaciones pendientes' : 'No hay verificaciones'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayed.map((v) => (
            <VerificationCard
              key={v.id}
              verification={v}
              onApprove={handleApprove}
              onReject={(id) => { setRejectModal({ verificationId: id }); setRejectReason(''); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FaceppResult({ verification }: { verification: any }) {
  const score: number | null = verification.face_match_score;

  if (score === null || score === undefined) {
    return (
      <div className="bg-slate-700/40 rounded-lg px-3 py-2 mb-4">
        <p className="text-slate-400 text-sm">Sin análisis biométrico</p>
      </div>
    );
  }

  const passed = score >= 75;

  return (
    <div className={`rounded-lg px-3 py-2.5 mb-4 flex items-center justify-between ${passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
      <span className="text-slate-300 text-sm font-medium">Análisis Face++</span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
        {Math.round(score)}% — {passed ? 'Auto-verificado' : 'Revisión manual'}
      </span>
    </div>
  );
}

function VerificationCard({
  verification,
  onApprove,
  onReject,
}: {
  verification: any;
  onApprove: (verificationId: string, bookingId: string) => void;
  onReject: (verificationId: string) => void;
}) {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{verification.user?.name || 'Usuario sin nombre'}</h3>
          <p className="text-slate-400 text-sm">{verification.user?.email}</p>
        </div>
        <StatusBadge status={verification.status} />
      </div>

      {/* Booking info */}
      {verification.booking && (
        <div className="bg-slate-700/40 rounded-lg px-3 py-2 mb-4">
          <p className="text-slate-300 text-sm font-medium">{verification.booking.property?.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {new Date(verification.booking.check_in).toLocaleDateString('es-CL')} →{' '}
            {new Date(verification.booking.check_out).toLocaleDateString('es-CL')}
          </p>
        </div>
      )}

      {/* Fecha envío */}
      <p className="text-slate-500 text-xs mb-4">
        Enviado {new Date(verification.created_at).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </p>

      {/* Face++ score */}
      <FaceppResult verification={verification} />

      {/* Documentos toggle */}
      <button
        onClick={() => setShowImages(!showImages)}
        className="w-full mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className={`w-4 h-4 transition-transform ${showImages ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {showImages ? 'Ocultar documentos' : 'Ver documentos'}
      </button>

      {showImages && (
        <div className="mb-4">
          <ImageViewer
            images={[
              { url: verification.selfie_url, label: 'Foto de rostro' },
              { url: verification.document_front_url, label: 'DNI - Frontal' },
              ...(verification.document_back_url
                ? [{ url: verification.document_back_url, label: 'DNI - Reverso' }]
                : []),
            ]}
          />
        </div>
      )}

      {/* Acciones pendiente */}
      {verification.status === 'pending' && verification.booking_id && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => onApprove(verification.id, verification.booking_id)}
            className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            ✓ Validar
          </button>
          <button
            onClick={() => onReject(verification.id)}
            className="flex-1 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-colors text-sm border border-red-500/20"
          >
            ✗ Rechazar
          </button>
        </div>
      )}

      {/* Info revisión */}
      {verification.status !== 'pending' && (
        <div className="bg-slate-700/40 rounded-lg px-3 py-2 mt-3">
          <p className="text-slate-400 text-xs">
            Revisado por <strong className="text-slate-300">{verification.reviewer?.name || 'Admin'}</strong> ·{' '}
            {new Date(verification.reviewed_at).toLocaleDateString('es-CL')}
          </p>
          {verification.rejection_reason && (
            <p className="text-red-400 text-xs mt-1">Motivo: {verification.rejection_reason}</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending:  { label: 'Pendiente',  color: 'bg-yellow-500/20 text-yellow-400' },
    approved: { label: 'Verificada', color: 'bg-emerald-500/20 text-emerald-400' },
    rejected: { label: 'Rechazada',  color: 'bg-red-500/20 text-red-400' },
  };
  const { label, color } = config[status] || config.pending;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
}
