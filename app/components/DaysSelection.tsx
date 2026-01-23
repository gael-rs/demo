'use client';

import { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../context';
import { calculatePrice, AMENITIES, SPACES } from '../data';
import Header from './Header';
import BookingInputField from './BookingInputField';

export default function DaysSelection() {
  const { state, setDays, goToStep, processPayment, verifyIdentity } = useBooking();

  // Local state for all fields
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [manualDays, setManualDays] = useState(30);
  const [kitInicio, setKitInicio] = useState(25000);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Get selected space details
  const selectedSpace = SPACES.find(s => s.id === state.selectedUnit?.id) || SPACES[0];

  // Calculate days from dates
  const calculateDaysFromDates = (start: Date, end: Date): number => {
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Determine effective days (from dates or manual input)
  const effectiveDays = useMemo(() => {
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      return calculateDaysFromDates(checkInDate, checkOutDate);
    }
    return manualDays;
  }, [checkInDate, checkOutDate, manualDays]);

  // Update context when days change
  useEffect(() => {
    setDays(effectiveDays);
  }, [effectiveDays, setDays]);

  // Calculate pricing
  const pricing = calculatePrice(effectiveDays);
  const valuePerDay = pricing.pricePerDay;
  const subtotal = pricing.total;
  const total = subtotal + kitInicio;

  // Kit de Inicio handlers
  const KIT_INCREMENT = 5000;
  const handleKitIncrease = () => {
    setKitInicio(prev => prev + KIT_INCREMENT);
  };
  const handleKitDecrease = () => {
    setKitInicio(prev => Math.max(0, prev - KIT_INCREMENT));
  };

  // Biometric validation
  const handleBiometricVerify = async () => {
    setBiometricStatus('verifying');
    // Simulate biometric verification
    setTimeout(() => {
      const success = Math.random() > 0.15; // 85% success rate
      setBiometricStatus(success ? 'verified' : 'failed');
    }, 2500);
  };

  // Payment handler
  const handlePayment = async () => {
    setPaymentError(null);

    // Process payment
    const paymentSuccess = await processPayment();

    if (!paymentSuccess) {
      setPaymentError('El pago falló. Por favor, intenta nuevamente.');
      return;
    }

    // Verify identity (biometric is already verified, but we call this for access code)
    const identitySuccess = await verifyIdentity();

    if (identitySuccess) {
      // Navigate to access-granted
      goToStep('access-granted');
    } else {
      setPaymentError('Error en la verificación. Por favor, intenta nuevamente.');
    }
  };

  // Validation: can proceed to payment?
  const canProceed = useMemo(() => {
    return (
      effectiveDays > 0 &&
      termsAccepted &&
      biometricStatus === 'verified'
    );
  }, [effectiveDays, termsAccepted, biometricStatus]);

  // Get amenity icons for selected space
  const spaceAmenities = selectedSpace.amenities
    .map(amenityId => AMENITIES.find(a => a.id === amenityId))
    .filter(Boolean)
    .slice(0, 8); // Max 8 amenities to display

  // Date validation error
  const dateError = checkInDate && checkOutDate && checkOutDate <= checkInDate;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="pt-20 px-4 pb-8 max-w-lg mx-auto">
        {/* Back Button */}
        <button
          onClick={() => goToStep('unit-selection')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        {/* Space Summary Card */}
        <div className="relative mb-6 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl shadow-amber-500/10">
          {/* Header: City + Category */}
          <div className="flex justify-between items-center px-4 py-3 bg-slate-800/90">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-white font-medium">{selectedSpace.city}</span>
            </div>
            <div className="px-3 py-1 bg-amber-500 rounded-full">
              <span className="text-slate-900 font-bold text-xs tracking-wide">
                {selectedSpace.category}
              </span>
            </div>
          </div>

          {/* Image */}
          <img
            src={selectedSpace.image}
            alt={selectedSpace.name}
            className="w-full h-48 object-cover"
          />

          {/* Amenities Row */}
          <div className="flex justify-center gap-2 p-3 bg-slate-800/90">
            {spaceAmenities.map(amenity => (
              <div
                key={amenity!.id}
                className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl hover:bg-slate-600 transition-colors"
                title={amenity!.label}
              >
                {amenity!.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-3 mb-6">
          {/* LLEGADA */}
          <BookingInputField
            label="LLEGADA"
            type="date"
            icon="calendar"
            value={checkInDate}
            onChange={(date: Date) => setCheckInDate(date)}
          />

          {/* SALIDA */}
          <BookingInputField
            label="SALIDA"
            type="date"
            icon="calendar"
            value={checkOutDate}
            onChange={(date: Date) => setCheckOutDate(date)}
          />

          {dateError && (
            <div className="text-red-400 text-sm -mt-2">
              La fecha de salida debe ser posterior a la llegada
            </div>
          )}

          {/* CANTIDAD DE DÍAS */}
          <div className="relative">
            <label className="block text-slate-400 text-xs uppercase mb-1 font-medium tracking-wide">
              CANTIDAD DE DÍAS
            </label>
            <input
              type="number"
              value={effectiveDays}
              onChange={e => setManualDays(parseInt(e.target.value) || 1)}
              readOnly={!!(checkInDate && checkOutDate && !dateError)}
              className={`
                w-full px-4 py-3 bg-slate-800 border rounded-lg transition-all text-white text-center text-lg font-semibold
                ${checkInDate && checkOutDate && !dateError
                  ? 'border-slate-700 cursor-not-allowed'
                  : 'border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50'
                }
              `}
              min={1}
            />
          </div>

          {/* VALOR × DÍA */}
          <BookingInputField
            label="VALOR × DÍA"
            type="currency"
            value={valuePerDay}
            readOnly
          />

          {/* SUBTOTAL ESTADÍA */}
          <BookingInputField
            label="SUBTOTAL ESTADÍA"
            type="currency"
            value={subtotal}
            readOnly
          />

          {/* Kit Inicio */}
          <div className="relative">
            <label className="block text-slate-400 text-xs uppercase mb-1 font-medium tracking-wide">
              Kit Inicio
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleKitDecrease}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={kitInicio <= 0}
              >
                -
              </button>
              <input
                type="text"
                value={new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  minimumFractionDigits: 0,
                }).format(kitInicio)}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-center font-medium cursor-not-allowed"
              />
              <button
                onClick={handleKitIncrease}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xl flex items-center justify-center transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* TOTAL ESTADÍA */}
          <BookingInputField
            label="TOTAL ESTADÍA"
            type="currency"
            value={total}
            readOnly
            highlighted
          />
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-slate-600 bg-slate-800 text-emerald-500 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
          />
          <span className="text-white text-sm group-hover:text-slate-200 transition-colors">
            Aceptar términos y condiciones
          </span>
        </label>

        {/* Biometric Validation */}
        <div className="mb-6">
          <h3 className="text-center text-slate-300 text-sm uppercase tracking-wide mb-4 font-medium">
            VALIDACIÓN BIOMÉTRICA
          </h3>

          <div className="relative w-32 h-40 mx-auto bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700">
            {/* Idle State */}
            {biometricStatus === 'idle' && (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            {/* Verifying State */}
            {biometricStatus === 'verifying' && (
              <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
              </div>
            )}

            {/* Verified State */}
            {biometricStatus === 'verified' && (
              <div className="w-full h-full flex items-center justify-center bg-emerald-500/20">
                <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Failed State */}
            {biometricStatus === 'failed' && (
              <div className="w-full h-full flex items-center justify-center bg-red-500/20">
                <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Biometric Action Buttons */}
          {biometricStatus === 'idle' && (
            <button
              onClick={handleBiometricVerify}
              className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Iniciar validación
            </button>
          )}

          {biometricStatus === 'failed' && (
            <button
              onClick={handleBiometricVerify}
              className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
            >
              Reintentar
            </button>
          )}

          {biometricStatus === 'verified' && (
            <div className="mt-4 text-center text-emerald-400 text-sm font-medium">
              ✓ Verificación exitosa
            </div>
          )}
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{paymentError}</p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!canProceed || state.paymentStatus === 'processing'}
          className={`
            w-full py-5 rounded-xl transition-all font-bold text-xl tracking-wide
            ${canProceed && state.paymentStatus !== 'processing'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30 active:scale-[0.98]'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {state.paymentStatus === 'processing' ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-slate-900 border-t-transparent"></div>
              <span>PROCESANDO...</span>
            </div>
          ) : (
            <>
              <span>PAGAR</span>
              <div className="mt-2 flex items-center justify-center">
                <div className="px-4 py-1 bg-white rounded">
                  <span className="text-slate-900 font-bold text-sm">webpay</span>
                </div>
              </div>
            </>
          )}
        </button>

        {!canProceed && (
          <div className="mt-3 text-center text-slate-400 text-xs">
            {!termsAccepted && '• Acepta los términos y condiciones'}
            {termsAccepted && biometricStatus !== 'verified' && '• Completa la validación biométrica'}
          </div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${selectedSpace.whatsappNumber.replace(/\+/g, '')}?text=Hola, estoy interesado en ${selectedSpace.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-600/40 transition-all hover:scale-110 z-50"
        title="Contactar por WhatsApp"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
