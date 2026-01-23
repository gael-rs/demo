import { Unit, PricingTier, AccommodationCategory, City, Amenity, Space } from './types';

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

export const ACCOMMODATION_CATEGORIES: AccommodationCategory[] = [
  {
    id: 'roomie',
    name: 'Roomie',
    tagline: 'Tu primer paso independiente',
    targetAudience: 'Estudiantes y jóvenes profesionales',
    idealDays: '1-7 días',
    priceRange: '$850/día',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    features: ['Espacios compartidos', 'WiFi de alta velocidad', 'Zona de estudio'],
    icon: '🎓',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Minimalista y funcional',
    targetAudience: 'Nómadas digitales y exploradores',
    idealDays: '8-14 días',
    priceRange: '$750/día',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    features: ['Estudio completo', 'Cocina equipada', 'Workspace dedicado'],
    icon: '💼',
  },
  {
    id: 'traveler',
    name: 'Traveler',
    tagline: 'Comodidad con estilo',
    targetAudience: 'Viajeros de negocios y estadías medias',
    idealDays: '15-30 días',
    priceRange: '$650/día',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    features: ['1 recámara', 'Balcón privado', 'Smart home'],
    icon: '✈️',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Espacio profesional premium',
    targetAudience: 'Ejecutivos y profesionales establecidos',
    idealDays: '31-60 días',
    priceRange: '$550/día',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    features: ['2 recámaras', 'Oficina en casa', 'Amenidades premium'],
    icon: '👔',
  },
  {
    id: 'family',
    name: 'Family',
    tagline: 'Hogar para todos',
    targetAudience: 'Familias en transición o temporada',
    idealDays: '61-90 días',
    priceRange: '$450/día',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    features: ['3 recámaras', 'Zona de juegos', 'Doble baño'],
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'tribu',
    name: 'Tribu',
    tagline: 'Comunidad y conexión',
    targetAudience: 'Grupos, startups y coliving',
    idealDays: '91+ días',
    priceRange: '$380/día',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    features: ['Espacios compartidos premium', 'Comunidad activa', 'Eventos mensuales'],
    icon: '🌟',
  },
];

// ============================================
// CITIES, AMENITIES & SPACES DATA
// ============================================

export const CITIES: City[] = [
  {
    id: 'la-serena',
    name: 'La Serena',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
    availableUnits: 12,
  },
  {
    id: 'vina-del-mar',
    name: 'Viña del Mar',
    image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&q=80',
    availableUnits: 8,
  },
  {
    id: 'santiago',
    name: 'Santiago',
    image: 'https://images.unsplash.com/photo-1555881400-69d1d5ef3ea6?w=800&q=80',
    availableUnits: 25,
  },
  {
    id: 'valdivia',
    name: 'Valdivia',
    image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    availableUnits: 6,
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
    name: 'Studio Acogedor Centro',
    category: 'ROOMIE',
    city: 'Viña del Mar',
    cityId: 'vina-del-mar',
    location: 'Barrio universitario',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    dailyRate: 12500,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity', 'gas'],
    description: 'Emplazado en centro urbano de Viña del Mar en barrio universitario con excelente conectividad y acceso inmediato a transporte público y privado, barrio seguro y residencial, entorno comercial y turístico importante, cercano a borde costero, miradores, restaurantes, supermercados, universidades, gimnasios, centros de salud y servicios en general. Todo a no más de cuatro cuadras a la redonda.',
    whatsappNumber: '+56912345678',
    ownerName: 'Juan Pérez',
  },
  {
    id: 'space-002',
    name: 'Departamento Playa Reñaca',
    category: 'TRAVELER',
    city: 'Viña del Mar',
    cityId: 'vina-del-mar',
    location: 'Reñaca Alto',
    image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
    dailyRate: 18000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity'],
    description: 'Hermoso departamento a pasos de la playa de Reñaca. Vista al mar, completamente amoblado con todas las comodidades para una estadía perfecta. Cercano a restaurantes, supermercados y vida nocturna. Ideal para profesionales que buscan tranquilidad con acceso rápido al centro de Viña.',
    whatsappNumber: '+56987654321',
    ownerName: 'María González',
  },
  {
    id: 'space-003',
    name: 'Loft Moderno La Serena',
    category: 'STARTER',
    city: 'La Serena',
    cityId: 'la-serena',
    location: 'Centro histórico',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    dailyRate: 11000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'bathroom', 'water', 'electricity', 'gas'],
    description: 'Loft completamente equipado en el corazón de La Serena. Arquitectura colonial restaurada con toques modernos. A pasos de la plaza de armas, museos, restaurantes y comercio. Perfecto para nómadas digitales con espacio de trabajo dedicado y conexión de alta velocidad.',
    whatsappNumber: '+56923456789',
    ownerName: 'Carlos Rojas',
  },
  {
    id: 'space-004',
    name: 'Casa Playa La Herradura',
    category: 'FAMILY',
    city: 'La Serena',
    cityId: 'la-serena',
    location: 'La Herradura',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    dailyRate: 22000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity', 'gas'],
    description: 'Amplia casa familiar frente al mar en La Herradura. 3 dormitorios, 2 baños, quincho y terraza con vista panorámica. Ideal para familias que buscan tranquilidad y contacto con la naturaleza. Zona segura con acceso directo a la playa.',
    whatsappNumber: '+56934567890',
    ownerName: 'Patricia Silva',
  },
  {
    id: 'space-005',
    name: 'Departamento Providencia',
    category: 'PRO',
    city: 'Santiago',
    cityId: 'santiago',
    location: 'Providencia',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    dailyRate: 25000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity'],
    description: 'Exclusivo departamento en el corazón de Providencia. 2 dormitorios, oficina equipada, gimnasio en el edificio. A pasos del metro, centros comerciales y corporativos. Ideal para ejecutivos que requieren confort y ubicación estratégica en Santiago.',
    whatsappNumber: '+56945678901',
    ownerName: 'Roberto Fernández',
  },
  {
    id: 'space-006',
    name: 'Studio Las Condes',
    category: 'ROOMIE',
    city: 'Santiago',
    cityId: 'santiago',
    location: 'Las Condes',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    dailyRate: 14500,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'bathroom', 'water', 'electricity'],
    description: 'Acogedor studio en Las Condes, perfecto para estudiantes o jóvenes profesionales. Edificio moderno con seguridad 24/7, cerca de universidades y zona financiera. Incluye todo lo necesario para una estadía cómoda.',
    whatsappNumber: '+56956789012',
    ownerName: 'Andrea Muñoz',
  },
  {
    id: 'space-007',
    name: 'Casa Río Valdivia',
    category: 'TRAVELER',
    city: 'Valdivia',
    cityId: 'valdivia',
    location: 'Isla Teja',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    dailyRate: 16000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'fridge', 'bathroom', 'water', 'electricity', 'gas'],
    description: 'Hermosa casa con vista al río Valdivia en Isla Teja. Rodeada de naturaleza y tranquilidad, pero a minutos del centro. Perfecta para quienes buscan desconexión sin perder comodidades urbanas. Incluye jardín privado y estacionamiento.',
    whatsappNumber: '+56967890123',
    ownerName: 'Luis Vargas',
  },
  {
    id: 'space-008',
    name: 'Loft Centro Valdivia',
    category: 'STARTER',
    city: 'Valdivia',
    cityId: 'valdivia',
    location: 'Centro',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    dailyRate: 13000,
    validityNote: '(válido para estadías sobre 30 días corridos)',
    amenities: ['wifi', 'tv', 'kitchen', 'bathroom', 'water', 'electricity'],
    description: 'Loft moderno en pleno centro de Valdivia. Diseño minimalista y funcional, ideal para nómadas digitales. A pasos de cafeterías, restaurantes, bancos y servicios. Excelente conexión a internet y espacio de trabajo.',
    whatsappNumber: '+56978901234',
    ownerName: 'Francisca Torres',
  },
];
