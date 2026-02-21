'use client';

import { useRef, useState, useEffect } from 'react';
import { compressImage } from '@/app/utils/imageCompression';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  type: 'selfie' | 'document';
}

export default function CameraCapture({ onCapture, onCancel, type }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    type === 'selfie' ? 'user' : 'environment'
  );
  const [error, setError] = useState<string>('');
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setError('');
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = async () => {
    if (!videoRef.current || capturing) return;

    setCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas');
      }

      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setCapturing(false);
            return;
          }

          const file = new File([blob], `${type}_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });

          const compressed = await compressImage(file, 0.8);
          onCapture(compressed);
        },
        'image/jpeg',
        0.9
      );
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Error al capturar la foto. Intenta nuevamente.');
      setCapturing(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Video stream */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay guide */}
        {type === 'selfie' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-emerald-400 border-dashed rounded-full w-64 h-64 opacity-50" />
          </div>
        )}

        {type === 'document' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-emerald-400 border-dashed rounded-2xl w-80 h-56 opacity-50" />
          </div>
        )}

        {/* Instructions */}
        <div className="absolute top-6 left-0 right-0 text-center">
          <div className="inline-block bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-white font-semibold">
              {type === 'selfie'
                ? 'Centra tu rostro en el círculo'
                : 'Centra tu documento en el recuadro'}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute bottom-32 left-0 right-0 px-4">
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 border-t border-slate-700 py-6 px-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
            disabled={capturing}
          >
            Cancelar
          </button>

          {/* Capture button */}
          <button
            onClick={capturePhoto}
            disabled={capturing || !!error}
            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 rounded-full flex items-center justify-center transition-colors border-4 border-white shadow-lg"
          >
            {capturing ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-16 h-16 bg-white rounded-full" />
            )}
          </button>

          {/* Toggle camera button */}
          <button
            onClick={toggleCamera}
            className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
            disabled={capturing}
          >
            🔄 Cambiar
          </button>
        </div>
      </div>
    </div>
  );
}
