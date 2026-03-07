'use client';

import { useState, useMemo, useEffect } from 'react';
import { useBooking } from '@/app/context';
import { AMENITIES } from '@/app/data';
import { City, Space, Unit } from '@/app/types';
import { getActiveProperties, Property } from '@/app/features/properties/property.service';
import SearchBar from '@/app/features/properties/components/SearchBar';
import CityCarousel from '@/app/features/properties/components/CityCarousel';
import SpaceDetailsCard from '@/app/features/properties/components/SpaceDetailsCard';

export default function UnitSelection() {
  const { selectUnit, currency, convertPrice } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [spacesVisible, setSpacesVisible] = useState(false);

  // Load properties from database
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getActiveProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  // Animate spaces in when city changes
  useEffect(() => {
    if (selectedCity) {
      setSpacesVisible(false);
      setSelectedCategory(null);
      const timer = setTimeout(() => setSpacesVisible(true), 60);
      return () => clearTimeout(timer);
    }
  }, [selectedCity?.id]);

  // Generate cities from available properties
  const availableCities = useMemo(() => {
    const cityMap = new Map<string, City>();

    properties.forEach(property => {
      if (!cityMap.has(property.city)) {
        cityMap.set(property.city, {
          id: property.city.toLowerCase().replace(/\s+/g, '-'),
          name: property.city,
          image: property.images && property.images.length > 0
            ? property.images[0]
            : '/img/prinipal.jpeg',
          availableUnits: 0,
        });
      }
      const city = cityMap.get(property.city)!;
      city.availableUnits += 1;
    });

    return Array.from(cityMap.values());
  }, [properties]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return availableCities;
    return availableCities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableCities]);

  // Convert properties to spaces format and filter by city
  const citySpaces = useMemo(() => {
    if (!selectedCity) return [];

    return properties
      .filter(property => property.city === selectedCity.name)
      .map(property => ({
        id: property.id,
        name: property.name,
        category: property.category || 'PRO',
        city: property.city,
        cityId: selectedCity.id,
        location: property.address,
        image: property.images && property.images.length > 0
          ? property.images[0]
          : '/img/living.png',
        dailyRate: property.base_price_clp,
        validityNote: '',
        amenities: property.amenities || [],
        description: property.description || '',
        whatsappNumber: '+56912345678', // You can add this to property table if needed
        ownerName: 'Homested Chile',
      } as Space));
  }, [selectedCity, properties]);

  // Unique categories in the selected city
  const availableCategories = useMemo(() => {
    const cats = new Set(citySpaces.map(s => s.category));
    return Array.from(cats);
  }, [citySpaces]);

  // Spaces filtered by selected category
  const filteredSpaces = useMemo(() => {
    if (!selectedCategory) return citySpaces;
    return citySpaces.filter(s => s.category === selectedCategory);
  }, [citySpaces, selectedCategory]);

  const handleSearch = () => {
    // Auto-select if only one result
    if (filteredCities.length === 1) {
      setSelectedCity(filteredCities[0]);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSelectedSpace(null); // Reset space selection when city changes
  };

  const handleSpaceSelect = (space: Space) => {
    setSelectedSpace(space);
    // Scroll to details card
    setTimeout(() => {
      document.getElementById('space-details')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleReserve = (space: Space) => {
    // Convert Space to Unit format for context
    const unit: Unit = {
      id: space.id,
      name: space.name,
      city: space.city,
      address: space.location,
      basePrice: space.dailyRate,
      image: space.image,
      amenities: space.amenities.map(id =>
        AMENITIES.find(a => a.id === id)?.label || id
      ),
    };

    selectUnit(unit);
    // Context auto-navigates to 'days-selection'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400">Cargando propiedades disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Search Section */}
      <div className="pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Encuentra tu espacio ideal
          </h1>
          <p className="text-slate-400 mb-6">
            Selecciona la ciudad donde deseas hospedarte
          </p>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* City Carousel Section */}
      <div className="py-8 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-xl font-semibold mb-6 text-center">
            CIUDADES DISPONIBLES
          </h2>
          <CityCarousel
            cities={filteredCities}
            selectedCity={selectedCity}
            onSelectCity={handleCitySelect}
          />
        </div>
      </div>

      {/* Space Selection Mini Cards */}
      {selectedCity && citySpaces.length > 0 && (
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-white text-xl font-semibold">
                Espacios en {selectedCity.name}
              </h2>
              {/* Category filter tags */}
              {availableCategories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      !selectedCategory
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Todos
                  </button>
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div
              className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ${
                spacesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {filteredSpaces.map((space, i) => (
                <div
                  key={space.id}
                  onClick={() => handleSpaceSelect(space)}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className={`
                    bg-slate-800 rounded-xl cursor-pointer p-1
                    transition-all duration-300
                    ${selectedSpace?.id === space.id
                      ? 'ring-4 ring-emerald-500 shadow-xl shadow-emerald-500/50 scale-[1.02]'
                      : 'hover:ring-2 hover:ring-emerald-400/50 hover:scale-[1.02]'
                    }
                  `}
                >
                  <div className="rounded-lg overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={space.image}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-400 text-slate-900 text-xs font-bold rounded-full uppercase">
                        {space.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <div className="text-emerald-400 font-bold text-lg">
                          {currency === 'USD' ? '$' : '$'}{convertPrice(space.dailyRate).toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800">
                    <h3 className="text-white font-semibold mb-1">
                      {space.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{space.location}</span>
                    </div>

                    {selectedSpace?.id === space.id && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Seleccionado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {selectedCity && citySpaces.length === 0 && (
        <div className="py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No hay espacios disponibles
            </h3>
            <p className="text-slate-400">
              Por el momento no tenemos espacios en {selectedCity.name}. Intenta con otra ciudad.
            </p>
          </div>
        </div>
      )}

      {/* No properties available */}
      {!selectedCity && availableCities.length === 0 && (
        <div className="py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <svg className="w-24 h-24 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-white text-xl font-semibold mb-2">
              No hay propiedades disponibles
            </h3>
            <p className="text-slate-400">
              Aún no tenemos propiedades publicadas. Vuelve pronto para ver nuestras opciones.
            </p>
          </div>
        </div>
      )}

      {/* No city selected message */}
      {!selectedCity && availableCities.length > 0 && (
        <div className="py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <svg className="w-24 h-24 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-white text-xl font-semibold mb-2">
              Selecciona una ciudad
            </h3>
            <p className="text-slate-400">
              Elige una ciudad del carrusel para ver los espacios disponibles
            </p>
          </div>
        </div>
      )}

      {/* Space Details Card */}
      {selectedSpace && (
        <div id="space-details" className="py-12 px-6 bg-slate-800/20">
          <div className="max-w-3xl mx-auto">
            <SpaceDetailsCard
              space={selectedSpace}
              onReserve={handleReserve}
            />
          </div>
        </div>
      )}

    </div>
  );
}
