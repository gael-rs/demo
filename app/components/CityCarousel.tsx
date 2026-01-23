'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { City } from '../types';

import 'swiper/css';
import 'swiper/css/navigation';

interface CityCarouselProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export default function CityCarousel({ cities, selectedCity, onSelectCity }: CityCarouselProps) {
  return (
    <div className="relative">
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center transition-colors shadow-lg">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center transition-colors shadow-lg">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        loop={false}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="px-12"
      >
        {cities.map((city) => (
          <SwiperSlide key={city.id}>
            <div
              onClick={() => onSelectCity(city)}
              className={`
                relative h-48 rounded-xl overflow-hidden cursor-pointer
                transition-all duration-300 hover:scale-105
                ${selectedCity?.id === city.id
                  ? 'ring-4 ring-emerald-500 shadow-xl shadow-emerald-500/50'
                  : 'hover:ring-2 hover:ring-amber-500'
                }
              `}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {city.name}
                </h3>
                <span className="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                  {city.availableUnits} espacios
                </span>
              </div>

              {selectedCity?.id === city.id && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
