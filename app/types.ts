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
  biometricStatus: 'idle' | 'verifying' | 'verified' | 'failed';
  accessCode: string | null;
  accessExpiry: Date | null;
  daysRemaining: number;
  kitInicio: number;
  bookingId: string | null; // ID de la reserva en Supabase
  basePricePerDay?: number;
  discountPercentage?: number;
  discountAmount?: number;
  termsAccepted: boolean; // Aceptación de términos y condiciones
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  days: number;
  price_per_day_clp: number;
  total_price_clp: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  base_price_clp?: number;
  discount_percentage?: number;
  discount_amount_clp?: number;
  created_at: string;
  updated_at: string;
  // Relaciones opcionales
  property?: Space;
}

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'user' | 'admin';
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

// ============================================
// CATEGORÍAS DE ALOJAMIENTO
// ============================================

export interface AccommodationCategory {
  id: string;
  name: string;
  tagline: string;
  targetAudience: string;
  idealDays: string;
  priceRange: string;
  image: string;
  features: string[];
  icon: string;
}

// ============================================
// SPACE SELECTION DATA TYPES
// ============================================

export interface City {
  id: string;
  name: string;
  image: string;
  availableUnits: number;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string; // emoji like '📶', '📺', etc.
}

export interface Space {
  id: string;
  name: string;
  category: string; // "ROOMIE", "STARTER", etc.
  city: string;
  cityId: string;
  location: string;
  image: string;
  dailyRate: number;
  validityNote: string;
  amenities: string[]; // Array of amenity IDs
  description: string;
  whatsappNumber: string;
  ownerName?: string;
}
