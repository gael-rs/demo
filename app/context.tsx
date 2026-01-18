'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingState, BookingStep, Unit } from './types';
import { calculatePrice, generateAccessCode, UNIT } from './data';

interface BookingContextType {
  state: BookingState;
  goToStep: (step: BookingStep) => void;
  selectUnit: (unit: Unit) => void;
  setDays: (days: number) => void;
  processPayment: () => Promise<boolean>;
  verifyIdentity: () => Promise<boolean>;
  extendStay: (additionalDays: number) => void;
  simulateExpiration: () => void;
  reset: () => void;
}

const initialState: BookingState = {
  step: 'landing',
  selectedUnit: null,
  days: 1,
  totalPrice: 0,
  pricePerDay: 0,
  checkInDate: null,
  checkOutDate: null,
  paymentStatus: 'pending',
  identityStatus: 'pending',
  accessCode: null,
  accessExpiry: null,
  daysRemaining: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const goToStep = (step: BookingStep) => {
    setState(prev => ({ ...prev, step }));
  };

  const selectUnit = (unit: Unit) => {
    const pricing = calculatePrice(1);
    setState(prev => ({
      ...prev,
      selectedUnit: unit,
      days: 1,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.total,
      step: 'days-selection',
    }));
  };

  const setDays = (days: number) => {
    const pricing = calculatePrice(days);
    setState(prev => ({
      ...prev,
      days,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.total,
    }));
  };

  const processPayment = (): Promise<boolean> => {
    return new Promise(resolve => {
      setState(prev => ({ ...prev, paymentStatus: 'processing' }));
      setTimeout(() => {
        const success = Math.random() > 0.1;
        setState(prev => ({
          ...prev,
          paymentStatus: success ? 'success' : 'failed',
        }));
        if (success) {
          setTimeout(() => goToStep('identity-verification'), 500);
        }
        resolve(success);
      }, 2000);
    });
  };

  const verifyIdentity = (): Promise<boolean> => {
    return new Promise(resolve => {
      setState(prev => ({ ...prev, identityStatus: 'verifying' }));
      setTimeout(() => {
        const success = Math.random() > 0.15;
        if (success) {
          const checkIn = new Date();
          const checkOut = new Date();
          checkOut.setDate(checkOut.getDate() + state.days);

          setState(prev => ({
            ...prev,
            identityStatus: 'verified',
            accessCode: generateAccessCode(),
            checkInDate: checkIn,
            checkOutDate: checkOut,
            accessExpiry: checkOut,
            daysRemaining: prev.days,
          }));
          setTimeout(() => goToStep('access-granted'), 500);
        } else {
          setState(prev => ({ ...prev, identityStatus: 'failed' }));
        }
        resolve(success);
      }, 2500);
    });
  };

  const extendStay = (newTotalDays: number) => {
    const pricing = calculatePrice(newTotalDays);
    const checkOut = new Date(state.checkInDate!);
    checkOut.setDate(checkOut.getDate() + newTotalDays);

    setState(prev => ({
      ...prev,
      days: newTotalDays,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.total,
      checkOutDate: checkOut,
      accessExpiry: checkOut,
      daysRemaining: newTotalDays,
      step: 'access-granted',
    }));
  };

  const simulateExpiration = () => {
    setState(prev => ({
      ...prev,
      daysRemaining: 0,
      step: 'expiration',
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        goToStep,
        selectUnit,
        setDays,
        processPayment,
        verifyIdentity,
        extendStay,
        simulateExpiration,
        reset,
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
