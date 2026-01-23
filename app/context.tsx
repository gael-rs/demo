'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BookingState, BookingStep, Unit, AuthState, LoginPayload, RegisterPayload } from './types';
import { calculatePrice, generateAccessCode } from './data';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkSession,
  persistSession,
  clearSession,
} from './services/auth.service';
import { supabase } from './lib/supabase';

interface BookingContextType {
  // Booking state
  state: BookingState;
  goToStep: (step: BookingStep) => void;
  selectUnit: (unit: Unit) => void;
  setDays: (days: number) => void;
  processPayment: () => Promise<boolean>;
  verifyIdentity: () => Promise<boolean>;
  extendStay: (additionalDays: number) => void;
  simulateExpiration: () => void;
  reset: () => void;

  // Auth state
  authState: AuthState;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;

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

  // Tasa de cambio aproximada: 1 USD = 950 CLP
  const USD_TO_CLP_RATE = 950;

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await checkSession();
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
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();

    // Listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Usuario cerró sesión
        clearSession();
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Usuario inició sesión o token fue refrescado
        const response = await checkSession();
        if (response.success && response.user) {
          setAuthState({
            isAuthenticated: true,
            user: response.user,
            loading: false,
            error: null,
          });
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ============================================
  // BOOKING FUNCTIONS
  // ============================================

  const goToStep = useCallback((step: BookingStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

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

  const setDays = useCallback((days: number) => {
    const pricing = calculatePrice(days);
    setState(prev => ({
      ...prev,
      days,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.total,
    }));
  }, []);

  const processPayment = useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      setState(prev => ({ ...prev, paymentStatus: 'processing' }));
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          // Generar directamente el código de acceso y configurar las fechas
          setState(prev => {
            const checkIn = new Date();
            const checkOut = new Date();
            checkOut.setDate(checkOut.getDate() + prev.days);

            return {
              ...prev,
              paymentStatus: 'success',
              identityStatus: 'verified',
              accessCode: generateAccessCode(),
              checkInDate: checkIn,
              checkOutDate: checkOut,
              accessExpiry: checkOut,
              daysRemaining: prev.days,
            };
          });
        } else {
          setState(prev => ({
            ...prev,
            paymentStatus: 'failed',
          }));
        }
        resolve(success);
      }, 2000);
    });
  }, []);

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

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await loginUser(payload);

      if (response.success && response.user && response.token) {
        persistSession(response.user, response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });
        // Volver al landing después de login exitoso
        setState(prev => ({ ...prev, step: 'landing' }));
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
        persistSession(response.user, response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });
        // Volver al landing después de registro exitoso
        setState(prev => ({ ...prev, step: 'landing' }));
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
      clearSession();
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
        processPayment,
        verifyIdentity,
        extendStay,
        simulateExpiration,
        reset,
        // Auth
        authState,
        login,
        register,
        logout,
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
