'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface PropertyImageCarouselProps {
  images: string[];
  propertyName: string;
}

export default function PropertyImageCarousel({
  images,
  propertyName,
}: PropertyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-slate-700 flex items-center justify-center rounded-xl">
        <span className="text-slate-400 text-lg">📷 Sin imágenes</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
      <Swiper
        modules={[Navigation, Pagination, Zoom]}
        navigation={images.length > 1}
        pagination={{ clickable: true }}
        zoom={{ maxRatio: 3 }}
        loop={images.length > 1}
        onSlideChange={(swiper: SwiperType) => setCurrentIndex(swiper.realIndex)}
        className="h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-zoom-container">
              <img
                src={image}
                alt={`${propertyName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg z-10">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
