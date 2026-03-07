'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { BookingState, BookingStep, Unit, AuthState, LoginPayload, RegisterPayload } from './types';
import { calculatePrice, generateAccessCode } from './data';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkSession,
} from './services/auth.service';
import { createBooking } from './services/booking.service';
import { calculatePropertyPrice } from './services/pricing.service';
import { supabase } from './lib/supabase';
import { hasUserAcceptedTerms, recordTermsAcceptance } from './services/terms.service';

interface BookingContextType {
  // Booking state
  state: BookingState;
  goToStep: (step: BookingStep) => void;
  selectUnit: (unit: Unit) => void;
  setDays: (days: number) => void;
  setDates: (checkIn: Date, checkOut: Date) => void;
  processPayment: () => Promise<boolean>;
  createBookingForPayment: () => Promise<string | null>;
  restorePaymentResult: () => Promise<void>;
  verifyIdentity: () => Promise<boolean>;
  extendStay: (additionalDays: number) => void;
  simulateExpiration: () => void;
  reset: () => void;
  setTermsAccepted: (accepted: boolean) => void;

  // Auth state
  authState: AuthState;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  authModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;

  // Currency state
  currency: 'CLP' | 'USD';
  setCurrency: (currency: 'CLP' | 'USD') => void;
  convertPrice: (priceInCLP: number) => number;
}

const initialBookingState: BookingState = {
  step: 'landing',
  selectedUnit: null,
  days: 1,
  totalPrice: 0,
  pricePerDay: 0,
  checkInDate: null,
  checkOutDate: null,
  paymentStatus: 'pending',
  identityStatus: 'pending',
  biometricStatus: 'idle',
  accessCode: null,
  accessExpiry: null,
  daysRemaining: 0,
  kitInicio: 25000,
  bookingId: null,
  basePricePerDay: 0,
  discountPercentage: 0,
  discountAmount: 0,
  termsAccepted: false,
};

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialBookingState);
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [currency, setCurrencyState] = useState<'CLP' | 'USD'>('CLP');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const afterAuthCallbackRef = useRef<(() => void) | null>(null);

  // Tasa de cambio aproximada: 1 USD = 950 CLP
  const USD_TO_CLP_RATE = 950;

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const response = await checkSession();
        if (!mounted) return;

        if (response.success && response.user) {
          setAuthState({
            isAuthenticated: true,
            user: response.user,
            loading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch {
        if (!mounted) return;
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();

    // Listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        // Usuario cerró sesión (Supabase limpia localStorage automáticamente)
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      } else if (event === 'TOKEN_REFRESHED') {
        // Solo refrescar en TOKEN_REFRESHED, no en SIGNED_IN (evita consultas duplicadas)
        const response = await checkSession();
        if (!mounted) return;

        if (response.success && response.user) {
          setAuthState({
            isAuthenticated: true,
            user: response.user,
            loading: false,
            error: null,
          });
        }
      }
      // SIGNED_IN se maneja directamente en login/register, no aquí
    });

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Detectar retorno desde MercadoPago al cargar la app
  useEffect(() => {
    restorePaymentResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // BOOKING FUNCTIONS
  // ============================================

  const setTermsAccepted = useCallback((accepted: boolean) => {
    setState(prev => ({ ...prev, termsAccepted: accepted }));
  }, []);

  const validateTermsAcceptance = useCallback(async (): Promise<boolean> => {
    if (!authState.user) {
      return false;
    }

    // Verificar si el usuario ha aceptado términos en la BD
    const hasAccepted = await hasUserAcceptedTerms(authState.user.id);
    return hasAccepted;
  }, [authState.user]);

  const goToStep = useCallback(async (step: BookingStep) => {
    // Validar aceptación de términos antes de permitir acceso a pasos críticos
    if ((step === 'identity-verification' || step === 'access-granted') && authState.user) {
      const hasAcceptedInState = state.termsAccepted;
      const hasAcceptedInDB = await validateTermsAcceptance();

      if (!hasAcceptedInState && !hasAcceptedInDB) {
        console.warn('Usuario no ha aceptado términos y condiciones');
        // No hacer nada, el flujo ya validó en el paso anterior
        setState(prev => ({ ...prev, step: 'payment' }));
        return;
      }
    }

    setState(prev => ({ ...prev, step }));
  }, [authState.user, state.termsAccepted, validateTermsAcceptance]);

  const selectUnit = useCallback((unit: Unit) => {
    const pricing = calculatePrice(1);
    setState(prev => ({
      ...prev,
      selectedUnit: unit,
      days: 1,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.total,
      step: 'days-selection',
    }));
  }, []);

  const setDays = useCallback(async (days: number) => {
    if (!state.selectedUnit) return;

    try {
      // Try to use new pricing service with discount rules
      const pricing = await calculatePropertyPrice(
        state.selectedUnit.id,
        state.selectedUnit.basePrice || state.pricePerDay,
        days
      );

      setState(prev => ({
        ...prev,
        days,
        pricePerDay: pricing.finalPricePerDay,
        totalPrice: pricing.totalPrice,
        basePricePerDay: pricing.basePrice,
        discountPercentage: pricing.discountPercentage,
        discountAmount: pricing.discountAmount,
      }));
    } catch (error) {
      // Fallback to old pricing if service fails
      console.error('Error calculating price, using fallback:', error);
      const pricing = calculatePrice(days);
      setState(prev => ({
        ...prev,
        days,
        pricePerDay: pricing.pricePerDay,
        totalPrice: pricing.total,
      }));
    }
  }, [state.selectedUnit, state.pricePerDay]);

  const setDates = useCallback((checkIn: Date, checkOut: Date) => {
    setState(prev => ({ ...prev, checkInDate: checkIn, checkOutDate: checkOut }));
  }, []);

  /**
   * Crea el booking en la DB con payment_status: 'pending' y retorna el ID.
   * Se usa antes de redirigir a MercadoPago.
   */
  const createBookingForPayment = useCallback(async (): Promise<string | null> => {
    if (!authState.user || !state.selectedUnit) return null;

    setState(prev => ({ ...prev, termsAccepted: true }));

    try {
      const checkIn = state.checkInDate || new Date();
      const checkOut = state.checkOutDate || (() => {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + state.days);
        return d;
      })();

      const booking = await createBooking({
        user_id: authState.user.id,
        property_id: state.selectedUnit.id,
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        days: state.days,
        price_per_day_clp: state.pricePerDay,
        total_price_clp: state.totalPrice,
        payment_status: 'pending',
        status: 'pending',
        base_price_clp: state.basePricePerDay || state.pricePerDay,
        discount_percentage: state.discountPercentage || 0,
        discount_amount_clp: state.discountAmount || 0,
      });

      // Registrar aceptación de términos
      await recordTermsAcceptance(authState.user.id, booking.id);

      setState(prev => ({
        ...prev,
        bookingId: booking.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      }));

      return booking.id;
    } catch (error) {
      console.error('Error creating booking for payment:', error);
      return null;
    }
  }, [authState.user, state.selectedUnit, state.days, state.pricePerDay, state.totalPrice,
      state.checkInDate, state.checkOutDate, state.basePricePerDay, state.discountPercentage, state.discountAmount]);

  /**
   * Al volver de MercadoPago, detecta el resultado en sessionStorage y restaura el estado.
   */
  const restorePaymentResult = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const resultRaw = sessionStorage.getItem('mp_payment_result');
    if (!resultRaw) return;

    sessionStorage.removeItem('mp_payment_result');

    try {
      const result = JSON.parse(resultRaw);
      const { success, bookingId, bookingState } = result;

      if (success && bookingState) {
        // Restaurar estado de la reserva y avanzar a verificación de identidad
        setState(prev => ({
          ...prev,
          bookingId: bookingId || bookingState.bookingId,
          days: bookingState.days,
          totalPrice: bookingState.totalPrice,
          pricePerDay: bookingState.pricePerDay,
          basePricePerDay: bookingState.basePricePerDay,
          discountPercentage: bookingState.discountPercentage,
          discountAmount: bookingState.discountAmount,
          checkInDate: bookingState.checkIn ? new Date(bookingState.checkIn) : null,
          checkOutDate: bookingState.checkOut ? new Date(bookingState.checkOut) : null,
          paymentStatus: 'success',
          termsAccepted: true,
          step: 'identity-verification',
        }));
      } else if (!result.pending) {
        // Pago fallido — volver al paso de pago
        setState(prev => ({
          ...prev,
          paymentStatus: 'failed',
          step: 'payment',
        }));
      }
    } catch (e) {
      console.error('Error restoring payment result:', e);
    }
  }, []);

  const processPayment = useCallback(async (): Promise<boolean> => {
    // Marcar términos como aceptados en el estado
    setState(prev => ({ ...prev, termsAccepted: true, paymentStatus: 'processing' }));

    try {
      // Simulación de procesamiento (mantener para demo)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const success = true; // Siempre exitoso para flujo de demo

      if (success && authState.user && state.selectedUnit) {
        const checkIn = state.checkInDate || new Date();
        const checkOut = state.checkOutDate || (() => { const d = new Date(checkIn); d.setDate(d.getDate() + state.days); return d; })();

        // Crear booking en Supabase
        const booking = await createBooking({
          user_id: authState.user.id,
          property_id: state.selectedUnit.id,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
          days: state.days,
          price_per_day_clp: state.pricePerDay,
          total_price_clp: state.totalPrice,
          payment_status: 'completed',
          status: 'pending', // Pendiente hasta verificación de identidad
          base_price_clp: state.basePricePerDay || state.pricePerDay,
          discount_percentage: state.discountPercentage || 0,
          discount_amount_clp: state.discountAmount || 0,
        });

        // Registrar aceptación de términos en BD
        await recordTermsAcceptance(authState.user.id, booking.id);

        setState(prev => ({
          ...prev,
          paymentStatus: 'success',
          bookingId: booking.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        }));

        return true;
      } else {
        setState(prev => ({
          ...prev,
          paymentStatus: 'failed',
        }));
        return false;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setState(prev => ({
        ...prev,
        paymentStatus: 'failed',
      }));
      return false;
    }
  }, [authState.user, state.selectedUnit, state.days, state.pricePerDay, state.totalPrice, state.checkInDate, state.checkOutDate, state.termsAccepted]);

  const verifyIdentity = useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      setState(prev => ({ ...prev, identityStatus: 'verifying' }));
      setTimeout(() => {
        const success = Math.random() > 0.15;
        if (success) {
          setState(prev => {
            const checkIn = new Date();
            const checkOut = new Date();
            checkOut.setDate(checkOut.getDate() + prev.days);

            return {
              ...prev,
              identityStatus: 'verified',
              accessCode: generateAccessCode(),
              checkInDate: checkIn,
              checkOutDate: checkOut,
              accessExpiry: checkOut,
              daysRemaining: prev.days,
            };
          });
          setTimeout(() => goToStep('access-granted'), 500);
        } else {
          setState(prev => ({ ...prev, identityStatus: 'failed' }));
        }
        resolve(success);
      }, 2500);
    });
  }, [goToStep]);

  const extendStay = useCallback((newTotalDays: number) => {
    setState(prev => {
      const pricing = calculatePrice(newTotalDays);
      const checkOut = new Date(prev.checkInDate!);
      checkOut.setDate(checkOut.getDate() + newTotalDays);

      return {
        ...prev,
        days: newTotalDays,
        pricePerDay: pricing.pricePerDay,
        totalPrice: pricing.total,
        checkOutDate: checkOut,
        accessExpiry: checkOut,
        daysRemaining: newTotalDays,
        step: 'access-granted',
      };
    });
  }, []);

  const simulateExpiration = useCallback(() => {
    setState(prev => ({
      ...prev,
      daysRemaining: 0,
      step: 'expiration',
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialBookingState);
  }, []);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  const openAuthModal = useCallback((onSuccess?: () => void) => {
    afterAuthCallbackRef.current = onSuccess || null;
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    afterAuthCallbackRef.current = null;
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await loginUser(payload);

      if (response.success && response.user && response.token) {
        // Supabase ya persistió la sesión automáticamente
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });
        setAuthModalOpen(false);
        if (afterAuthCallbackRef.current) {
          afterAuthCallbackRef.current();
          afterAuthCallbackRef.current = null;
        }
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Error al iniciar sesión',
        }));
        return false;
      }
    } catch {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error de conexión. Intenta de nuevo.',
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await registerUser(payload);

      if (response.success && response.user && response.token) {
        // Supabase ya persistió la sesión automáticamente
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });

        // Registrar aceptación de términos tras registro exitoso
        try {
          await recordTermsAcceptance(response.user.id);
          setState(prev => ({ ...prev, termsAccepted: true }));
        } catch (error) {
          console.error('Error recording terms acceptance on registration:', error);
        }

        setAuthModalOpen(false);
        if (afterAuthCallbackRef.current) {
          afterAuthCallbackRef.current();
          afterAuthCallbackRef.current = null;
        }
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Error al crear cuenta',
        }));
        return false;
      }
    } catch {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error de conexión. Intenta de nuevo.',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await logoutUser();
    } finally {
      // Supabase ya limpió el localStorage automáticamente
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  // ============================================
  // CURRENCY FUNCTIONS
  // ============================================

  const setCurrency = useCallback((newCurrency: 'CLP' | 'USD') => {
    setCurrencyState(newCurrency);
  }, []);

  const convertPrice = useCallback((priceInCLP: number): number => {
    if (currency === 'USD') {
      return Math.round(priceInCLP / USD_TO_CLP_RATE);
    }
    return priceInCLP;
  }, [currency]);

  return (
    <BookingContext.Provider
      value={{
        // Booking
        state,
        goToStep,
        selectUnit,
        setDays,
        setDates,
        processPayment,
        createBookingForPayment,
        restorePaymentResult,
        verifyIdentity,
        extendStay,
        simulateExpiration,
        reset,
        setTermsAccepted,
        // Auth
        authState,
        login,
        register,
        logout,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        // Currency
        currency,
        setCurrency,
        convertPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
