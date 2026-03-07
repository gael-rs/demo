'use client';

import { useState, useEffect, useCallback } from 'react';
import { getActiveProperties, Property } from '@/app/features/properties/property.service';
import { useBooking } from '@/app/context';

export default function PropertyShowcase() {
  const { currency, convertPrice, goToStep } = useBooking();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadProperties = async () => {
      try {
        const data = await getActiveProperties();

        if (!isMounted) return;

        // Seleccionar hasta 5 propiedades aleatorias
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(5, data.length));

        setProperties(selected);
      } catch (error: any) {
        if (!isMounted) return;

        // Ignorar errores de abort
        if (error?.name === 'AbortError') {
          console.log('Request was aborted, ignoring...');
          return;
        }

        console.error('Error loading properties:', error);
        setProperties([]); // Mostrar vacío en caso de error
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (properties.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [properties.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  }, [properties.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const handleViewAvailability = () => {
    goToStep('unit-selection');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400">Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-white text-xl font-semibold mb-2">
            No hay propiedades disponibles
          </h3>
          <p className="text-slate-400">
            Estamos preparando increíbles opciones para ti. Vuelve pronto.
          </p>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];
  const regularPriceClp = Math.round(currentProperty.base_price_clp * 0.10);
  const longStayPriceClp = Math.round(currentProperty.base_price_clp * 0.033);
  const displayRegularPrice = convertPrice(regularPriceClp);
  const displayLongStayPrice = convertPrice(longStayPriceClp);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">Inmuebles disponibles</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {properties.length === 1 ? 'Nuestro Inmueble Disponible' : 'Opciones Destacadas'}
        </h2>
        <p className="text-slate-400 text-base">
          {properties.length === 1
            ? 'Departamento moderno listo para ti'
            : 'Encuentra el hogar para esta etapa de tu vida.'}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="max-w-2xl mx-auto relative">
        {/* Navigation Arrows - Desktop (a los lados) */}
        {properties.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 w-12 h-12 bg-slate-800 hover:bg-emerald-500 border border-slate-700 hover:border-emerald-400 rounded-full items-center justify-center transition-all group shadow-xl"
              aria-label="Propiedad anterior"
            >
              <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 w-12 h-12 bg-slate-800 hover:bg-emerald-500 border border-slate-700 hover:border-emerald-400 rounded-full items-center justify-center transition-all group shadow-xl"
              aria-label="Siguiente propiedad"
            >
              <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Property Card */}
        <div className="group relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

          {/* Card content wrapper */}
          <div className="relative bg-slate-800 rounded-3xl m-[2px]">
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={currentProperty.images && currentProperty.images.length > 0
                  ? currentProperty.images[0]
                  : '/img/living.png'}
                alt={currentProperty.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* City Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-400 text-slate-900 text-sm font-bold rounded-full uppercase shadow-lg">
                {currentProperty.city}
              </div>

              {/* Category Badge */}
              {currentProperty.category && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                  {currentProperty.category}
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />

              {/* Property Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">
                  {currentProperty.name}
                </h3>
                <div className="flex items-center gap-2 text-emerald-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-sm md:text-base font-medium line-clamp-1">{currentProperty.address}</span>
                </div>
              </div>

            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Price */}
              <div className="mb-4 pb-4 border-b border-slate-700/50">
                <div className="flex items-stretch gap-3">
                  {/* Regular price */}
                  <div className="flex-1 px-3 py-2.5 rounded-xl bg-slate-700/40">
                    <p className="text-slate-500 text-xs mb-1">1–7 días</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-slate-300 font-semibold text-lg">
                        ${displayRegularPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                      </span>
                      <span className="text-slate-500 text-xs">{currency}/día</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Long-stay price */}
                  <div className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-500 text-xs mb-1">31–60 días</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-emerald-400 font-bold text-2xl">
                        ${displayLongStayPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                      </span>
                      <span className="text-slate-400 text-xs">{currency}/día</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {currentProperty.description && (
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {currentProperty.description.length > 150
                    ? `${currentProperty.description.substring(0, 150)}...`
                    : currentProperty.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 pb-6 border-b border-slate-700/50 mb-6">
                <div className="flex flex-col items-center gap-1 py-2">
                  <div className="text-emerald-400 font-bold text-2xl leading-none">{currentProperty.capacity}</div>
                  <div className="text-slate-500 text-xs">Personas</div>
                </div>
                <div className="flex flex-col items-center gap-1 py-2 border-x border-slate-700">
                  <div className="text-emerald-400 font-bold text-2xl leading-none">{currentProperty.bedrooms}</div>
                  <div className="text-slate-500 text-xs">Dormitorios</div>
                </div>
                <div className="flex flex-col items-center gap-1 py-2">
                  <div className="text-emerald-400 font-bold text-2xl leading-none">{currentProperty.bathrooms}</div>
                  <div className="text-slate-500 text-xs">Baños</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleViewAvailability}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/50 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Ver disponibilidad
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators - Only show if more than 1 property */}
        {properties.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-emerald-500'
                    : 'w-2 bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Ir a propiedad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
