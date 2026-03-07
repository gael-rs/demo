'use client';

import { useState } from 'react';
import { uploadPropertyImage, deletePropertyImage } from '@/app/features/properties/property.service';

interface PropertyImageUploaderProps {
  propertyId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function PropertyImageUploader({
  propertyId,
  images,
  onImagesChange,
}: PropertyImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (files.length === 0) {
      alert('Por favor, sube solo archivos de imagen');
      return;
    }

    await uploadFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Subiendo imagen ${i + 1} de ${files.length}...`);
        const url = await uploadPropertyImage(files[i], propertyId);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      onImagesChange([...images, ...uploadedUrls]);
      setUploadProgress('');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir algunas imágenes. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string, index: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      await deletePropertyImage(imageUrl);
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-600 bg-slate-800/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="property-images"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-300">{uploadProgress}</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4">📤</div>
            <p className="text-slate-300 mb-2">
              Arrastra imágenes aquí o{' '}
              <label htmlFor="property-images" className="text-emerald-400 cursor-pointer hover:text-emerald-300">
                selecciona archivos
              </label>
            </p>
            <p className="text-slate-500 text-sm">
              JPG, PNG, WebP. Múltiples archivos permitidos.
            </p>
          </>
        )}
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-400">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} subidas
          </p>

          <div className="space-y-2">
            {images.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm truncate">
                    {url.split('/').pop()}
                  </p>
                  {index === 0 && (
                    <span className="text-emerald-400 text-xs font-semibold">
                      ⭐ Imagen Principal
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(url, index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  title="Eliminar imagen"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
