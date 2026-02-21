'use client';

import { useState } from 'react';
import { useBooking } from '../context';

interface HeaderProps {
  onCtaClick?: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  const { authState, logout, goToStep, currency, setCurrency } = useBooking();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Mis Reservas', href: '/mis-reservas', authRequired: true },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Precios', href: '#precios' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    goToStep('auth');
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

  const currencyFlags = {
    CLP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/32px-Flag_of_Chile.svg.png',
    USD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/32px-Flag_of_the_United_States.svg.png',
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo-moon.png"
              alt="Homested"
              className="h-10 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map(item => {
              if (item.authRequired && !authState.isAuthenticated) return null;
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
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <img
                  src={currencyFlags[currency]}
                  alt={currency}
                  className="w-5 h-4 object-cover rounded-sm"
                />
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
                    <img
                      src={currencyFlags.CLP}
                      alt="CLP"
                      className="w-5 h-4 object-cover rounded-sm"
                    />
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
                    <img
                      src={currencyFlags.USD}
                      alt="USD"
                      className="w-5 h-4 object-cover rounded-sm"
                    />
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
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar sesión
              </button>
            )}

            {/* CTA Button - Desktop */}
            <button
              onClick={onCtaClick}
              className="hidden sm:block px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Entrar a vivir
            </button>

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <nav className="flex flex-col px-6 py-4">
              {/* User Info (Mobile) */}
              {!authState.loading && authState.isAuthenticated && authState.user && (
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-700">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {authState.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{authState.user.name}</p>
                    <p className="text-slate-400 text-sm">{authState.user.email}</p>
                  </div>
                </div>
              )}

              {menuItems.map(item => {
                if (item.authRequired && !authState.isAuthenticated) return null;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 text-slate-300 hover:text-white transition-colors border-b border-slate-700"
                  >
                    {item.label}
                  </a>
                );
              })}

              {/* Currency Selector (Mobile) */}
              <div className="py-3 border-b border-slate-700">
                <p className="text-slate-400 text-sm mb-2 uppercase">Moneda</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCurrencyChange('CLP')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currency === 'CLP'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <img
                      src={currencyFlags.CLP}
                      alt="CLP"
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                    <span className="text-sm font-medium">CLP</span>
                  </button>
                  <button
                    onClick={() => handleCurrencyChange('USD')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currency === 'USD'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <img
                      src={currencyFlags.USD}
                      alt="USD"
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                    <span className="text-sm font-medium">USD</span>
                  </button>
                </div>
              </div>

              {/* Auth & CTA Buttons (Mobile) */}
              {authState.loading ? (
                <div className="mt-4 w-full h-12 bg-slate-700 rounded-lg animate-pulse" />
              ) : authState.isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                >
                  Iniciar sesión
                </button>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onCtaClick?.();
                }}
                className="mt-3 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
              >
                Entrar a vivir
              </button>
            </nav>
          </div>
        )}
      </header>

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
