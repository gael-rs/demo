'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBooking } from '@/app/context';
import { AMENITIES, SPACES } from '@/app/data';
import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';
import BookingInputField from './BookingInputField';
import Modal from '@/app/shared/components/Modal';
import { getDiscountRulesForProperty } from '@/app/features/booking/pricing.service';
import type { DiscountRule } from '@/app/features/booking/pricing.service';

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DAYS_HEADER = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export default function DaysSelection() {
  const { state, setDays, setDates, goToStep, processPayment, currency, convertPrice, setTermsAccepted } = useBooking();

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [leftMonth, setLeftMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; message: string; type: 'info' | 'error' | 'warning' }>({ title: '', message: '', type: 'info' });

  const selectedSpace = SPACES.find(s => s.id === state.selectedUnit?.id) || SPACES[0];
  const basePrice = state.selectedUnit?.basePrice || 35000;

  // Today at midnight
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const rightMonth = useMemo(
    () => new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1),
    [leftMonth]
  );

  // Fetch discount rules once
  useEffect(() => {
    if (state.selectedUnit) {
      getDiscountRulesForProperty(state.selectedUnit.id).then(setDiscountRules);
    }
  }, [state.selectedUnit]);

  // Client-side price for N nights — mirrors calculatePropertyPrice logic
  const computePriceForDays = useCallback((days: number): number => {
    const applicable = discountRules
      .filter(r => r.min_days <= days && r.max_days >= days)
      .sort((a, b) => b.discount_percentage - a.discount_percentage);
    const discount = applicable[0]?.discount_percentage ?? 0;
    return basePrice - Math.round((basePrice * discount) / 100);
  }, [basePrice, discountRules]);

  // Sync dates + days to context when selection is complete
  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      setDays(days);
      setDates(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate, setDays, setDates]);

  const effectiveDays =
    checkInDate && checkOutDate && checkOutDate > checkInDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const valuePerDay = convertPrice(state.pricePerDay);
  const subtotal = convertPrice(state.totalPrice);
  const canProceed = effectiveDays > 0;

  // ── Calendar interaction ─────────────────────────────
  const handleDateClick = (date: Date) => {
    if (date < today) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start fresh
      setCheckInDate(date);
      setCheckOutDate(null);
    } else {
      // Have check-in, waiting for check-out
      if (date.getTime() <= checkInDate.getTime()) {
        setCheckInDate(date); // clicked on or before check-in → new check-in
      } else {
        setCheckOutDate(date);
      }
    }
  };

  const prevMonth = () => {
    setLeftMonth(prev => {
      const candidate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      const floor = new Date(today.getFullYear(), today.getMonth(), 1);
      return candidate >= floor ? candidate : prev;
    });
  };

  const nextMonth = () => {
    setLeftMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleReset = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  // ── Render one month grid ─────────────────────────────
  const renderMonthGrid = (monthStart: Date) => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // The "end" used for range highlight: confirmed checkout, or hovered date while picking checkout
    const effectiveEnd = checkOutDate || (checkInDate && !checkOutDate ? hoveredDate : null);

    const cells: React.ReactNode[] = [];

    // Offset spacers
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`sp-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isCheckIn = checkInDate && date.getTime() === checkInDate.getTime();
      const isCheckOut = checkOutDate && date.getTime() === checkOutDate.getTime();
      const isInRange =
        checkInDate && effectiveEnd &&
        date > checkInDate && date < effectiveEnd &&
        effectiveEnd > checkInDate;

      // Price preview: for check-in and days in the confirmed range
      let priceText: string | null = null;
      if (checkInDate && checkOutDate) {
        if (isCheckIn) {
          // Show price for first day
          priceText = convertPrice(computePriceForDays(1)).toLocaleString('es-CL');
        } else if (isInRange && date > checkInDate && date < checkOutDate) {
          // Show accumulated price for intermediate days
          const nights = Math.ceil((date.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          priceText = convertPrice(computePriceForDays(nights)).toLocaleString('es-CL');
        }
      }

      cells.push(
        <div
          key={day}
          className={[
            'relative flex flex-col items-center justify-center select-none transition-colors',
            isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
            'min-h-[60px]', // Altura mínima fija para evitar que se aplasten
          ].join(' ')}
          onClick={() => !isPast && handleDateClick(date)}
          onMouseEnter={() => {
            if (!isPast && checkInDate && !checkOutDate) setHoveredDate(date);
          }}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div
            className={[
              'w-10 h-10 flex items-center justify-center rounded-full text-base transition-all',
              isCheckIn || isCheckOut
                ? 'bg-emerald-500 text-white font-bold'
                : isToday
                  ? 'ring-2 ring-emerald-400 text-emerald-300 font-medium'
                  : isInRange
                    ? 'bg-emerald-500/15 text-slate-200'
                    : 'text-slate-300',
              !isPast && !isCheckIn && !isCheckOut && !isInRange ? 'hover:bg-slate-700/50' : '',
            ].join(' ')}
          >
            {day}
          </div>
          {priceText && (
            <span className="text-emerald-400 text-[10px] leading-tight mt-1 font-medium">{priceText}</span>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 font-semibold text-center mb-2 capitalize text-sm">
          {MONTHS_ES[month]} {year}
        </p>
        <div className="grid grid-cols-7">
          {DAYS_HEADER.map(d => (
            <div key={d} className="text-slate-500 text-xs text-center py-1 font-medium">{d}</div>
          ))}
          {cells}
        </div>
      </div>
    );
  };

  // ── Helpers ───────────────────────────────────────────
  const formatDate = (d: Date) => `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}`;

  const spaceAmenities = selectedSpace.amenities
    .map(amenityId => AMENITIES.find(a => a.id === amenityId))
    .filter(Boolean)
    .slice(0, 8);

  // ── Payment ───────────────────────────────────────────
  const handlePayment = async () => {
    if (!state.termsAccepted) {
      setModalConfig({
        title: 'Términos y Condiciones',
        message: 'Debes aceptar los términos y condiciones para continuar con el pago.',
        type: 'warning'
      });
      setShowModal(true);
      return;
    }

    setPaymentError(null);
    const ok = await processPayment();
    if (!ok) {
      setModalConfig({
        title: 'Error en el pago',
        message: 'El pago falló. Por favor, intenta nuevamente.',
        type: 'error'
      });
      setShowModal(true);
    } else {
      goToStep('identity-verification');
    }
  };

  // ── Render ────────────────────────────────────────────
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
        <div className="relative mb-6 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10">
          <div className="flex justify-between items-center px-4 py-3 bg-slate-800/90">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-white font-medium">{selectedSpace.city}</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500 rounded-full">
              <span className="text-white font-bold text-xs tracking-wide">
                {selectedSpace.category}
              </span>
            </div>
          </div>

          <img
            src={selectedSpace.image}
            alt={selectedSpace.name}
            className="w-full h-48 object-cover"
          />

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

        {/* ── Interactive Calendar ── */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-4">
          {/* Nav row */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleReset}
              className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors"
            >
              Limpiar
            </button>

            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Two month grids stacked */}
          <div className="flex flex-col gap-5">
            {renderMonthGrid(leftMonth)}
            {renderMonthGrid(rightMonth)}
          </div>

          {/* Selection summary bar */}
          <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-center gap-2 text-sm flex-wrap">
            {checkInDate ? (
              <>
                <span className="text-emerald-400 font-semibold">{formatDate(checkInDate)}</span>
                <span className="text-slate-600">→</span>
                {checkOutDate ? (
                  <>
                    <span className="text-emerald-400 font-semibold">{formatDate(checkOutDate)}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">
                      {effectiveDays} noche{effectiveDays !== 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 italic">selecciona fecha de salida</span>
                )}
              </>
            ) : (
              <span className="text-slate-500 italic">Selecciona fecha de llegada</span>
            )}
          </div>
        </div>

        {/* Pricing summary */}
        <div className="space-y-3 mb-6">
          <BookingInputField
            label="VALOR × DÍA"
            type="currency"
            value={valuePerDay}
            readOnly
            currency={currency}
          />

          <BookingInputField
            label="TOTAL A PAGAR"
            type="currency"
            value={subtotal}
            readOnly
            highlighted
            currency={currency}
          />
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={state.termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-700 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                <svg
                  className={`w-3 h-3 text-white transition-opacity ${state.termsAccepted ? 'opacity-100' : 'opacity-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
              Acepto los{' '}
              <a
                href="/terminos-y-condiciones"
                target="_blank"
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a
                href="/politica-de-privacidad"
                target="_blank"
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                política de privacidad
              </a>
            </span>
          </label>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!canProceed || !state.termsAccepted || state.paymentStatus === 'processing'}
          className={`
            w-full py-5 rounded-xl transition-all font-bold text-lg tracking-wide relative overflow-hidden
            ${canProceed && state.termsAccepted && state.paymentStatus !== 'processing'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98]'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {state.paymentStatus === 'processing' ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
              <span>PROCESANDO PAGO...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>PROCEDER AL PAGO</span>
            </div>
          )}
        </button>

        <p className="mt-4 text-center text-slate-400 text-xs">
          Después del pago, deberás verificar tu identidad
        </p>
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

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}
