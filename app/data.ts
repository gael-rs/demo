import { Unit, PricingTier, AccommodationCategory, City, Amenity, Space } from './types';

export const UNIT: Unit = {
  id: 'unit-001',
  name: 'Departamento Moderno',
  city: 'Santiago',
  address: 'Santiago Centro, Chile',
  basePrice: 35000,
  image: '/img/living.png',
  amenities: ['WiFi', 'Cocina equipada', 'TV', 'Frigorífico', 'Baño'],
};

export const PRICING_TIERS: PricingTier[] = [
  { minDays: 1, maxDays: 7, pricePerDay: 35000 },
  { minDays: 8, maxDays: 14, pricePerDay: 32000 },
  { minDays: 15, maxDays: 30, pricePerDay: 28000 },
  { minDays: 31, maxDays: 60, pricePerDay: 25000 },
  { minDays: 61, maxDays: 90, pricePerDay: 22000 },
  { minDays: 91, maxDays: 365, pricePerDay: 20000 },
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

export const ACCOMMODATION_CATEGORIES: AccommodationCategory[] = [
  {
    id: 'roomie',
    name: 'Roomie',
    tagline: 'Tu primer paso independiente',
    targetAudience: 'Estudiantes y jóvenes profesionales',
    idealDays: '1-7 días',
    priceRange: '$12.500/día',
    image: '/img/roomie.png',
    features: ['Espacios compartidos', 'WiFi de alta velocidad', 'Zona de estudio'],
    icon: '🎓',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Minimalista y funcional',
    targetAudience: 'Nómadas digitales y exploradores',
    idealDays: '8-14 días',
    priceRange: '$18.000/día',
    image: '/img/starter.png',
    features: ['Estudio completo', 'Cocina equipada', 'Workspace dedicado'],
    icon: '💼',
  },
  {
    id: 'traveler',
    name: 'Traveler',
    tagline: 'Comodidad con estilo',
    targetAudience: 'Viajeros de negocios y estadías medias',
    idealDays: '15-30 días',
    priceRange: '$22.000/día',
    image: '/img/traveler.png',
    features: ['1 recámara', 'Balcón privado', 'Smart home'],
    icon: '✈️',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Espacio profesional premium',
    targetAudience: 'Ejecutivos y profesionales establecidos',
    idealDays: '31-60 días',
    priceRange: '$35.000/día',
    image: '/img/pro.png',
    features: ['2 recámaras', 'Oficina en casa', 'Amenidades premium'],
    icon: '👔',
  },
  {
    id: 'family',
    name: 'Family',
    tagline: 'Hogar para todos',
    targetAudience: 'Familias en transición o temporada',
    idealDays: '61-90 días',
    priceRange: '$28.000/día',
    image: '/img/family.png',
    features: ['3 recámaras', 'Zona de juegos', 'Doble baño'],
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'tribu',
    name: 'Tribu',
    tagline: 'Comunidad y conexión',
    targetAudience: 'Grupos, startups y coliving',
    idealDays: '91+ días',
    priceRange: '$32.000/día',
    image: '/img/tribu.png',
    features: ['Espacios compartidos premium', 'Comunidad activa', 'Eventos mensuales'],
    icon: '🌟',
  },
];

// ============================================
// CITIES, AMENITIES & SPACES DATA
// ============================================

export const CITIES: City[] = [
  {
    id: 'santiago',
    name: 'Santiago',
    image: '/img/prinipal.jpeg',
    availableUnits: 1,
  },
];

export const AMENITIES: Amenity[] = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'tv', label: 'TV', icon: '📺' },
  { id: 'kitchen', label: 'Cocina', icon: '🍳' },
  { id: 'fridge', label: 'Frigorífico', icon: '❄️' },
  { id: 'bathroom', label: 'Baño', icon: '🚿' },
  { id: 'water', label: 'Agua', icon: '💧' },
  { id: 'electricity', label: 'Luz', icon: '💡' },
  { id: 'gas', label: 'Gas', icon: '🔥' },
];

export const SPACES: Space[] = [
  {
    id: 'space-001',
    name: 'Departamento Moderno',
    category: 'PRO',
    city: 'Santiago',
    cityId: 'santiago',
    location: 'Santiago Centro',
    image: '/img/living.png',
    dailyRate: 35000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity', 'gas'],
    description: 'Hermoso departamento completamente amoblado en el corazón de Santiago. Ubicación privilegiada con excelente conectividad a transporte público y privado. A pasos de metro, centros comerciales, restaurantes, y servicios. Ideal para profesionales y familias. Incluye cocina equipada, living amplio, habitaciones confortables y baño moderno.',
    whatsappNumber: '+56912345678',
    ownerName: 'Homestead Chile',
  },
];
