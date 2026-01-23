'use client';

import Image from 'next/image';
import { AccommodationCategory } from '../types';

interface CategoryCardProps {
  category: AccommodationCategory;
  onClick?: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-emerald-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {/* Image with Logo Badge */}
      <div className="relative aspect-[4/3]">
        <Image
          src={category.image}
          alt={`${category.name} - ${category.tagline}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Logo Badge */}
        <div className="absolute top-3 right-3 w-8 h-8 opacity-90">
          <Image
            src="/logo-moon.png"
            alt="Homested Quality Badge"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Category Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-2xl font-bold text-white">{category.name}</h3>
          </div>
          <p className="text-emerald-400 font-medium mb-1">{category.tagline}</p>
          <p className="text-slate-300 text-sm">{category.targetAudience}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {category.features.map((feature, index) => (
            <span
              key={index}
              className="bg-slate-700/50 text-slate-300 text-sm px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price and Duration */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">{category.idealDays}</span>
          <span className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg">
            {category.priceRange}
          </span>
        </div>
      </div>
    </div>
  );
}
