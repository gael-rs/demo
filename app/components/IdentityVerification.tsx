'use client';

import { useState, useEffect } from 'react';
import { useBooking } from '../context';
import { uploadVerificationDocument, createVerificationRequest } from '../services/verification.service';
import { hasUserAcceptedTerms } from '../services/terms.service';
import DocumentUpload from './DocumentUpload';
import { fileToDataURL } from '../utils/imageCompression';
import Header from './Header';
import Footer from './Footer';

export default function IdentityVerification() {
  const { state, authState, goToStep } = useBooking();
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceMatched, setFaceMatched] = useState<boolean | null>(null);
  const [termsValidated, setTermsValidated] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // File states
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  // Preview URLs
  const [documentFrontPreview, setDocumentFrontPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // Validar términos al montar
  useEffect(() => {
    const validateTerms = async () => {
      if (!authState.user) {
        setShowTermsModal(true);
        return;
      }

      // Verificar si el usuario aceptó términos en el estado o en BD
      const hasAcceptedInState = state.termsAccepted;
      const hasAcceptedInDB = await hasUserAcceptedTerms(authState.user.id);

      if (!hasAcceptedInState && !hasAcceptedInDB) {
        setShowTermsModal(true);
      } else {
        setTermsValidated(true);
      }
    };

    validateTerms();
  }, [authState.user, state.termsAccepted]);

  const handleFileChange = async (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    if (file) {
      setFile(file);
      const dataUrl = await fileToDataURL(file);
      setPreview(dataUrl);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!documentFront || !selfie) {
      setError('Debes subir los documentos requeridos: foto de rostro y DNI frontal');
      return;
    }

    if (!authState.user || !state.bookingId) {
      setError('Error: Usuario no autenticado o sin reserva activa');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload document front
      const documentFrontUrl = await uploadVerificationDocument(
        documentFront,
        authState.user.id,
        state.bookingId,
        'document-front'
      );

      // Upload selfie
      const selfieUrl = await uploadVerificationDocument(
        selfie,
        authState.user.id,
        state.bookingId,
        'selfie'
      );

      // Create verification request
      const verification = await createVerificationRequest({
        user_id: authState.user.id,
        booking_id: state.bookingId,
        document_front_url: documentFrontUrl,
        selfie_url: selfieUrl,
      });

      // Comparación biométrica con Face++
      const faceRes = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verification.id,
          selfieUrl,
          documentFrontUrl,
        }),
      });

      const faceData = await faceRes.json();
      setFaceMatched(faceData.matched === true);
      setUploaded(true);
    } catch (err) {
      console.error('Error uploading verification:', err);
      setError('Error al subir los documentos. Por favor intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Modal bloqueante si no se aceptaron términos
  if (showTermsModal) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-red-500/30">
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Términos no aceptados
            </h2>
            <p className="text-slate-400 text-center mb-6">
              Debes aceptar los términos y condiciones antes de continuar con la verificación de identidad.
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>⚠️ Requisito obligatorio:</strong><br/>
                Para proceder con tu reserva, debes aceptar nuestros términos y condiciones en el paso de pago.
              </p>
            </div>

            <button
              onClick={() => goToStep('payment')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors mb-3"
            >
              Volver al pago
            </button>

            <button
              onClick={() => goToStep('landing')}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Ir a inicio
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (uploaded) {
    const isApproved = faceMatched === true;

    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-6 flex flex-col items-center">
          <div className="max-w-md w-full">
            {/* Icon */}
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${
              isApproved
                ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30'
                : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
            }`}>
              {isApproved ? (
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              {isApproved ? '¡Identidad verificada!' : 'Reserva en proceso'}
            </h2>
            <p className="text-slate-400 text-center mb-6">
              {isApproved
                ? 'Tu verificación biométrica fue aprobada automáticamente'
                : 'Tu identidad será revisada por nuestro equipo'}
            </p>

            <div className="bg-slate-800 rounded-xl p-6 mb-6">
              {isApproved ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <p className="text-emerald-400 text-sm">
                    <strong>Verificación exitosa:</strong><br/>
                    Tu rostro coincide con tu documento de identidad. Recibirás el <strong>código de acceso</strong> próximamente.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-slate-300 mb-4 text-center">
                    No pudimos verificar automáticamente tu identidad. Tu solicitud será
                    <strong className="text-white"> revisada manualmente</strong> por nuestro equipo.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>Documentos recibidos:</strong><br/>
                      • Foto de rostro<br/>
                      • DNI frontal
                    </p>
                  </div>
                </>
              )}

              <p className="text-slate-400 text-sm text-center mt-4">
                Recibirás el <strong className="text-emerald-400">código de acceso</strong> una vez confirmada tu reserva.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => goToStep('landing')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
              >
                Ir a inicio
              </button>

              <a
                href="/mis-reservas"
                className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Ver mis reservas
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Pago completado</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Verifica tu identidad</h1>
        <p className="text-slate-400 mb-8">Último paso para habilitar tu acceso</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-slate-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="space-y-6">
            {/* Selfie */}
            <DocumentUpload
              label="Foto de tu rostro"
              type="selfie"
              onFileSelected={(file) => handleFileChange(file, setSelfie, setSelfiePreview)}
              preview={selfiePreview || undefined}
              required
              cameraOnly
            />

            {/* Documento frontal */}
            <DocumentUpload
              label="DNI - Lado Frontal (Cédula o Pasaporte)"
              type="document-front"
              onFileSelected={(file) => handleFileChange(file, setDocumentFront, setDocumentFrontPreview)}
              preview={documentFrontPreview || undefined}
              required
            />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-400 text-sm">
            <strong>Importante:</strong> Asegúrate de que las fotos sean nítidas y los datos del documento
            sean legibles. Tu solicitud será revisada manualmente por nuestro equipo.
          </p>
        </div>

        {isUploading ? (
          <div className="w-full py-4 px-8 bg-slate-700 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verificando identidad...
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!documentFront || !selfie || !termsValidated}
            className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
          >
            Enviar para verificación
          </button>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
