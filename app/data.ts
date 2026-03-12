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
    idealDays: '30+ días',
    priceRange: '',
    image: '/img/roomie.png',
    features: ['1 persona máx.', 'WiFi de alta velocidad', 'Zona de estudio'],
    icon: '🎓',
    maxPersons: 1,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Espacio profesional premium',
    targetAudience: 'Ejecutivos y profesionales',
    idealDays: '30+ días',
    priceRange: '',
    image: '/img/pro.png',
    features: ['2 personas máx.', 'Oficina en casa', 'Amenidades premium'],
    icon: '👔',
    maxPersons: 2,
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Minimalista y funcional',
    targetAudience: 'Familias y grupos pequeños',
    idealDays: '30+ días',
    priceRange: '',
    image: '/img/starter.png',
    features: ['3 personas máx.', 'Cocina equipada', 'Workspace dedicado'],
    icon: '🏠',
    maxPersons: 3,
  },
];

// ============================================
// CITIES, AMENITIES & SPACES DATA
// ============================================

// Lista de ciudades principales de Chile
export const CHILE_CITIES = [
  'Arica',
  'Iquique',
  'Antofagasta',
  'Calama',
  'Copiapó',
  'La Serena',
  'Coquimbo',
  'Valparaíso',
  'Viña del Mar',
  'Santiago',
  'Rancagua',
  'Talca',
  'Curicó',
  'Concepción',
  'Talcahuano',
  'Los Ángeles',
  'Chillán',
  'Temuco',
  'Valdivia',
  'Osorno',
  'Puerto Montt',
  'Puerto Varas',
  'Coyhaique',
  'Punta Arenas',
];

// Esta es la lista antigua para mantener compatibilidad
// Ahora se generará dinámicamente desde las propiedades
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
