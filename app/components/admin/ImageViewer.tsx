'use client';

import { useState } from 'react';

interface ImageViewerProps {
  images: Array<{
    url: string;
    label: string;
  }>;
}

export default function ImageViewer({ images }: ImageViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
        No hay imágenes disponibles
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main viewer with zoom */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px] p-4 overflow-auto">
          <img
            src={currentImage.url}
            alt={currentImage.label}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.2s',
            }}
            className="max-w-full object-contain cursor-zoom-in"
            onClick={() => setZoomLevel((z) => (z >= 3 ? 1 : z + 0.5))}
          />
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
            disabled={zoomLevel <= 1}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors"
          >
            −
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
            disabled={zoomLevel >= 3}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors"
          >
            +
          </button>
        </div>

        {/* Image label */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-white font-semibold">{currentImage.label}</p>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setZoomLevel(1);
              }}
              className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                index === selectedIndex
                  ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">
                  {img.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
        <p className="text-slate-400 text-sm">
          💡 Click en la imagen para hacer zoom. Usa los botones para ajustar el nivel.
        </p>
      </div>
    </div>
  );
}
