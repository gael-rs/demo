'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBooking } from '@/app/context';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, authState } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 1, label: 'Débil', color: 'bg-red-500' };
    if (score <= 3) return { level: 2, label: 'Media', color: 'bg-yellow-500' };
    return { level: 3, label: 'Fuerte', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (phone && !/^[+]?[\d\s-]{8,}$/.test(phone)) {
      newErrors.phone = 'Ingresa un teléfono válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await register({
      name: name.trim(),
      email,
      password,
      phone: phone || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Row 1: Nombre + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="register-name" className="block text-xs font-medium text-slate-300 mb-1">
            Nombre completo
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Juan Pérez"
            className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-slate-700'
            }`}
            disabled={authState.loading}
          />
          {errors.name && <p className="mt-0.5 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="register-email" className="block text-xs font-medium text-slate-300 mb-1">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            placeholder="tu@email.com"
            className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-slate-700'
            }`}
            disabled={authState.loading}
          />
          {errors.email && <p className="mt-0.5 text-xs text-red-400">{errors.email}</p>}
        </div>
      </div>

      {/* Row 2: Teléfono + Contraseña */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="register-phone" className="block text-xs font-medium text-slate-300 mb-1">
            Teléfono <span className="text-slate-500">(opcional)</span>
          </label>
          <input
            id="register-phone"
            type="tel"
            value={phone}
            onChange={e => {
              setPhone(e.target.value);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
            }}
            placeholder="+56 9 1234 5678"
            className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.phone ? 'border-red-500' : 'border-slate-700'
            }`}
            disabled={authState.loading}
          />
          {errors.phone && <p className="mt-0.5 text-xs text-red-400">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="register-password" className="block text-xs font-medium text-slate-300 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="Mín. 6 caracteres"
              className={`w-full px-3 py-2 pr-9 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                errors.password ? 'border-red-500' : 'border-slate-700'
              }`}
              disabled={authState.loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {password && (
            <div className="mt-1 flex gap-1">
              {[1, 2, 3].map(level => (
                <div key={level} className={`h-0.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.level ? passwordStrength.color : 'bg-slate-700'}`} />
              ))}
            </div>
          )}
          {errors.password && <p className="mt-0.5 text-xs text-red-400">{errors.password}</p>}
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="register-confirm-password" className="block text-xs font-medium text-slate-300 mb-1">
          Confirmar contraseña
        </label>
        <input
          id="register-confirm-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="Repite tu contraseña"
          className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
            errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
          }`}
          disabled={authState.loading}
        />
        {errors.confirmPassword && <p className="mt-0.5 text-xs text-red-400">{errors.confirmPassword}</p>}
      </div>

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={e => {
              setAcceptTerms(e.target.checked);
              if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
            }}
            className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 flex-shrink-0"
            disabled={authState.loading}
          />
          <span className="text-xs text-slate-400 leading-relaxed">
            Acepto los{' '}
            <Link href="/terminos-y-condiciones" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/politica-de-privacidad" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline">
              política de privacidad
            </Link>
          </span>
        </label>
        {errors.terms && <p className="mt-0.5 text-xs text-red-400">{errors.terms}</p>}
      </div>

      {/* Error Message */}
      {authState.error && (
        <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-xs">{authState.error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={authState.loading}
        className="w-full py-2.5 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm"
      >
        {authState.loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-slate-400 text-xs">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
