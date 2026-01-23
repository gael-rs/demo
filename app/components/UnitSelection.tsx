'use client';

import { useState, useMemo } from 'react';
import { useBooking } from '../context';
import { CITIES, SPACES, AMENITIES } from '../data';
import { City, Space, Unit } from '../types';
import Header from './Header';
import SearchBar from './SearchBar';
import CityCarousel from './CityCarousel';
import SpaceDetailsCard from './SpaceDetailsCard';

export default function UnitSelection() {
  const { selectUnit, currency, convertPrice } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES;
    return CITIES.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get spaces for selected city
  const citySpaces = useMemo(() => {
    if (!selectedCity) return [];
    return SPACES.filter(space => space.cityId === selectedCity.id);
  }, [selectedCity]);

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

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Search Section */}
      <div className="pt-24 pb-8 px-6">
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
            <h2 className="text-white text-xl font-semibold mb-6">
              Espacios en {selectedCity.name}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {citySpaces.map(space => (
                <div
                  key={space.id}
                  onClick={() => handleSpaceSelect(space)}
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

      {/* No city selected message */}
      {!selectedCity && (
        <div className="py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🗺️</div>
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
