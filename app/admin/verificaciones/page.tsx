'use client';

import { useEffect, useState } from 'react';
import {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
} from '@/app/features/identity/verification.service';
import {
  updateBookingStatus,
  updateBookingIdentityVerification,
} from '@/app/features/booking/booking.service';
import ImageViewer from '@/app/features/admin/components/ImageViewer';
import { supabase } from '@/app/shared/lib/supabase';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
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
  }, [filter]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const data = filter === 'pending'
        ? await getPendingVerifications()
        : await getAllVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId: string, bookingId: string) => {
    if (!currentUser) { showToast('Error: Usuario no autenticado', 'error'); return; }

    try {
      await approveVerification(verificationId, currentUser.id);
      await updateBookingIdentityVerification(bookingId, true);
      await updateBookingStatus(bookingId, 'confirmed');
      showToast('Verificación validada correctamente', 'success');
      await loadVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      showToast('Error al aprobar la verificación', 'error');
    }
  };

  const handleRejectConfirm = async () => {
    if (!currentUser || !rejectModal) return;
    try {
      await rejectVerification(rejectModal.verificationId, currentUser.id, rejectReason || 'Sin especificar');
      showToast('Verificación rechazada correctamente', 'success');
      setRejectModal(null);
      setRejectReason('');
      await loadVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      showToast('Error al rechazar la verificación', 'error');
    }
  };

  const handleReject = (verificationId: string) => {
    setRejectModal({ verificationId });
    setRejectReason('');
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

      <h1 className="text-3xl font-bold text-white mb-8">Verificaciones de Identidad</h1>

      {/* Filter tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            filter === 'pending'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Pendientes ({verifications.filter(v => v.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Todas
        </button>
      </div>

      {/* Verifications Grid */}
      {verifications.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No hay verificaciones {filter === 'pending' ? 'pendientes' : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {verifications.map((verification) => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FaceppResult({ verification }: { verification: any }) {
  const [showJson, setShowJson] = useState(false);
  const score: number | null = verification.face_match_score;

  if (score === null || score === undefined) {
    return (
      <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
        <p className="text-slate-400 text-sm">Sin análisis biométrico</p>
      </div>
    );
  }

  const passed = score >= 75;

  return (
    <div className="bg-slate-700/50 rounded-lg p-3 mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-sm font-medium">Análisis Face++</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {Math.round(score)}% — {passed ? 'Auto-verificado' : 'No coincide — revisión manual'}
        </span>
      </div>
      {verification.facepp_response && (
        <>
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            {showJson ? 'Ocultar respuesta API' : 'Ver respuesta API'}
          </button>
          {showJson && (
            <pre className="bg-slate-900 rounded p-2 text-xs text-slate-300 overflow-auto max-h-48 whitespace-pre-wrap break-all">
              {JSON.stringify(verification.facepp_response, null, 2)}
            </pre>
          )}
        </>
      )}
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
    <div className="bg-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {verification.user?.name || 'Usuario sin nombre'}
          </h3>
          <p className="text-slate-400 text-sm">{verification.user?.email}</p>
          <p className="text-slate-500 text-xs mt-1">
            ID: {verification.id.substring(0, 8)}...
          </p>
        </div>
        <StatusBadge status={verification.status} />
      </div>

      {/* Booking Info */}
      {verification.booking && (
        <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
          <p className="text-slate-300 text-sm">
            <strong>Reserva:</strong> {verification.booking.property?.name}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {new Date(verification.booking.check_in).toLocaleDateString()} - {new Date(verification.booking.check_out).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Date */}
      <p className="text-slate-400 text-sm mb-4">
        Enviado: {new Date(verification.created_at).toLocaleString()}
      </p>

      {/* Face++ Result */}
      <FaceppResult verification={verification} />

      {/* Images Toggle */}
      <button
        onClick={() => setShowImages(!showImages)}
        className="w-full mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {showImages ? '⬆️ Ocultar documentos' : '⬇️ Ver documentos'}
      </button>

      {/* Images with ImageViewer */}
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

      {/* Actions: solo cuando está pendiente */}
      {verification.status === 'pending' && verification.booking_id && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(verification.id, verification.booking_id)}
            className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors"
          >
            ✓ Validar
          </button>
          <button
            onClick={() => onReject(verification.id)}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors"
          >
            ✗ No validar
          </button>
        </div>
      )}

      {/* Review Info */}
      {verification.status !== 'pending' && (
        <div className="bg-slate-700/50 rounded-lg p-3 mt-4">
          <p className="text-slate-300 text-sm">
            <strong>Revisado por:</strong> {verification.reviewer?.name || 'Admin'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {new Date(verification.reviewed_at).toLocaleString()}
          </p>
          {verification.rejection_reason && (
            <p className="text-red-400 text-sm mt-2">
              <strong>Motivo:</strong> {verification.rejection_reason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
    approved: { label: 'Verificada', color: 'bg-green-500/20 text-green-400' },
    rejected: { label: 'Rechazada', color: 'bg-red-500/20 text-red-400' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}
