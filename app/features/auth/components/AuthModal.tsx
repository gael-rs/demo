'use client';

import { useState, useEffect } from 'react';
import { useBooking } from '@/app/context';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthTab = 'login' | 'register';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useBooking();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Reset to login tab whenever modal opens
  useEffect(() => {
    if (authModalOpen) setActiveTab('login');
  }, [authModalOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Homested</span>
            </div>
            <p className="text-slate-400 text-sm">
              {activeTab === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
            {activeTab === 'login' ? (
              <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
