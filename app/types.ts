export type BookingStep =
  | 'landing'
  | 'auth'
  | 'unit-selection'
  | 'days-selection'
  | 'payment'
  | 'identity-verification'
  | 'access-granted'
  | 'extend-stay'
  | 'expiration';

export interface Unit {
  id: string;
  name: string;
  city: string;
  address: string;
  basePrice: number;
  image: string;
  amenities: string[];
}

export interface PricingTier {
  minDays: number;
  maxDays: number;
  pricePerDay: number;
}

export interface BookingState {
  step: BookingStep;
  selectedUnit: Unit | null;
  days: number;
  totalPrice: number;
  pricePerDay: number;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  paymentStatus: 'pending' | 'processing' | 'success' | 'failed';
  identityStatus: 'pending' | 'verifying' | 'verified' | 'failed';
  accessCode: string | null;
  accessExpiry: Date | null;
  daysRemaining: number;
}

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
