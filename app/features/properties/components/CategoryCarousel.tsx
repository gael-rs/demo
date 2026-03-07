'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import CategoryCard from './CategoryCard';
import { ACCOMMODATION_CATEGORIES } from '@/app/data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function CategoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = (categoryId: string) => {
    // Visual showcase only for MVP - no action on click
    console.log('Category clicked:', categoryId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Encuentra tu espacio ideal
        </h2>
        <p className="text-slate-400 text-lg">
          Diferentes espacios para cada momento de tu vida
        </p>
      </div>

      {/* Carousel Container */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
        onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
        className="!pb-12"
      >
        {ACCOMMODATION_CATEGORIES.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryCard
              category={category}
              onClick={() => handleCardClick(category.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .swiper-pagination-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background: rgb(71 85 105);
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .swiper-pagination-bullet:hover {
          background: rgb(100 116 139);
        }

        .swiper-pagination-bullet-active {
          width: 2rem;
          background: rgb(52 211 153);
        }
      `}</style>
    </div>
  );
}
