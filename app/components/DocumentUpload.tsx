'use client';

import { useState } from 'react';
import CameraCapture from './CameraCapture';

interface DocumentUploadProps {
  label: string;
  type: 'selfie' | 'document-front' | 'document-back';
  onFileSelected: (file: File) => void;
  preview?: string;
  required?: boolean;
  cameraOnly?: boolean;
}

export default function DocumentUpload({
  label,
  type,
  onFileSelected,
  preview,
  required = false,
  cameraOnly = false,
}: DocumentUploadProps) {
  const [showCamera, setShowCamera] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        type={type.includes('selfie') ? 'selfie' : 'document'}
        onCapture={(file) => {
          onFileSelected(file);
          setShowCamera(false);
        }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-contain rounded-xl bg-slate-800 border border-slate-700"
          />
          <button
            onClick={() => onFileSelected(null as any)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={cameraOnly ? 'flex' : 'grid grid-cols-2 gap-3'}>
          {/* Camera button */}
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="flex-1 border-2 border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800/50 hover:bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all"
          >
            <span className="text-3xl">📷</span>
            <span className="text-sm text-slate-300 font-medium">Tomar Foto</span>
          </button>

          {/* File upload button (hidden when cameraOnly) */}
          {!cameraOnly && (
            <label className="border-2 border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800/50 hover:bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="text-3xl">📁</span>
              <span className="text-sm text-slate-300 font-medium">Subir Archivo</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
