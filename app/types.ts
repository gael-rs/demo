export type BookingStep =
  | 'landing'
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
