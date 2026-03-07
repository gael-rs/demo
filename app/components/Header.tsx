'use client';

import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useBooking } from '../context';

interface HeaderProps {
  onCtaClick?: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  const { authState, logout, goToStep, currency, setCurrency, openAuthModal } = useBooking();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const menuItems = [
    { label: '¿Cómo funciona?', href: '/#como-funciona' },
    { label: '¿Beneficios?', href: '/#beneficios' },
    { label: '¿Precios?', href: '/#precios' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    openAuthModal();
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    logout();
  };

  const handleLogoClick = () => {
    // Si estamos en la página raíz, hacer scroll arriba
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      goToStep('landing');
    } else {
      // Si estamos en otra página, redirigir a la raíz
      window.location.href = '/';
    }
  };

  const handleCurrencyChange = (newCurrency: 'CLP' | 'USD') => {
    setCurrency(newCurrency);
    setIsCurrencyMenuOpen(false);
  };

  const currencyCountry = {
    CLP: 'CL',
    USD: 'US',
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md" aria-label="Ir al inicio">
            <img
              src="/logo-moon.png"
              alt="Homested"
              width={120}
              height={56}
              className="h-14 w-auto object-contain"
            />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map(item => {

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Currency Selector - Desktop */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                aria-label={`Moneda actual: ${currency}`}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ReactCountryFlag countryCode={currencyCountry[currency]} svg style={{ width: '1.25rem', height: '1rem' }} aria-hidden="true" />
                <span className="text-white text-sm font-medium">{currency}</span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${isCurrencyMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => handleCurrencyChange('CLP')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                      currency === 'CLP' ? 'bg-slate-700' : ''
                    }`}
                  >
                    <ReactCountryFlag countryCode="CL" svg style={{ width: '1.25rem', height: '1rem' }} aria-hidden="true" />
                    <span className="text-white text-sm">CLP</span>
                    {currency === 'CLP' && (
                      <svg className="w-4 h-4 text-emerald-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleCurrencyChange('USD')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                      currency === 'USD' ? 'bg-slate-700' : ''
                    }`}
                  >
                    <ReactCountryFlag countryCode="US" svg style={{ width: '1.25rem', height: '1rem' }} aria-hidden="true" />
                    <span className="text-white text-sm">USD</span>
                    {currency === 'USD' && (
                      <svg className="w-4 h-4 text-emerald-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Button - Desktop */}
            {authState.loading ? (
              <div className="hidden sm:block w-24 h-10 bg-slate-800 rounded-lg animate-pulse" />
            ) : authState.isAuthenticated && authState.user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Menú de usuario"
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authState.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {authState.user.name.split(' ')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-white font-medium truncate">{authState.user.name}</p>
                      <p className="text-slate-400 text-sm truncate">{authState.user.email}</p>
                    </div>
                    <a
                      href="/mis-reservas"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Mis Reservas
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar sesión
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Menú"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </header>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 md:hidden w-72 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <span className="text-white font-semibold text-base">Menú</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        {!authState.loading && authState.isAuthenticated && authState.user && (
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-800/40">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {authState.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{authState.user.name}</p>
              <p className="text-slate-400 text-xs truncate">{authState.user.email}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {menuItems.map(item => {
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Currency + Auth — bottom */}
        <div className="px-4 py-4 border-t border-slate-800 space-y-3">
          {/* Currency */}
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 px-1">Moneda</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCurrencyChange('CLP')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currency === 'CLP' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ReactCountryFlag countryCode="CL" svg style={{ width: '1.25rem', height: '1rem' }} aria-hidden="true" />
                CLP
              </button>
              <button
                onClick={() => handleCurrencyChange('USD')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currency === 'USD' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ReactCountryFlag countryCode="US" svg style={{ width: '1.25rem', height: '1rem' }} aria-hidden="true" />
                USD
              </button>
            </div>
          </div>

          {/* Auth */}
          {authState.loading ? (
            <div className="w-full h-11 bg-slate-800 rounded-xl animate-pulse" />
          ) : authState.isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-slate-800 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Overlay to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Overlay to close currency menu */}
      {isCurrencyMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCurrencyMenuOpen(false)}
        />
      )}
    </>
  );
}
