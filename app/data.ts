import { Unit, PricingTier } from './types';

export const UNIT: Unit = {
  id: 'unit-001',
  name: 'Studio Moderno Centro',
  city: 'Ciudad de México',
  address: 'Colonia Roma Norte, CDMX',
  basePrice: 850,
  image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsYSUyMGRlJTIwZXN0YXIlMjBtb2Rlcm5hfGVufDB8fDB8fHww',
  amenities: ['WiFi', 'Cocina equipada', 'Aire acondicionado', 'Smart TV'],
};

export const PRICING_TIERS: PricingTier[] = [
  { minDays: 1, maxDays: 7, pricePerDay: 850 },
  { minDays: 8, maxDays: 14, pricePerDay: 750 },
  { minDays: 15, maxDays: 30, pricePerDay: 650 },
  { minDays: 31, maxDays: 60, pricePerDay: 550 },
  { minDays: 61, maxDays: 90, pricePerDay: 450 },
  { minDays: 91, maxDays: 365, pricePerDay: 380 },
];

export function calculatePrice(days: number): { pricePerDay: number; total: number } {
  const tier = PRICING_TIERS.find(t => days >= t.minDays && days <= t.maxDays)
    || PRICING_TIERS[PRICING_TIERS.length - 1];

  return {
    pricePerDay: tier.pricePerDay,
    total: tier.pricePerDay * days,
  };
}

export function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
