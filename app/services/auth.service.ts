/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN - HOMESTED
 * ============================================
 *
 * Este archivo contiene funciones mock para autenticación.
 *
 * INSTRUCCIONES PARA DESARROLLADOR DE BACKEND:
 * --------------------------------------------
 * Reemplaza el contenido de cada función con llamadas
 * reales a tu API. La estructura de datos ya está definida
 * en app/types.ts (LoginPayload, RegisterPayload, AuthResponse).
 *
 * Ejemplo con fetch:
 *
 * export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
 *   const response = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload)
 *   });
 *   return response.json();
 * }
 *
 * ============================================
 */

import { LoginPayload, RegisterPayload, AuthResponse, User } from '../types';

// Simula delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

// Usuario mock para pruebas
const MOCK_USER: User = {
  id: 'user-001',
  email: 'usuario@homested.com',
  name: 'Usuario Homested',
  phone: '+52 55 1234 5678',
};

// Token mock
const MOCK_TOKEN = 'mock-jwt-token-xyz123';

/**
 * LOGIN
 * -----
 * Autentica un usuario existente.
 *
 * @param payload - Email y contraseña del usuario
 * @returns AuthResponse con usuario y token si es exitoso
 *
 * TODO Backend: Reemplazar con llamada real a POST /api/auth/login
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  await simulateNetworkDelay();

  // MOCK: Acepta cualquier email con password "123456"
  // TODO: Reemplazar con validación real del backend
  if (payload.password === '123456') {
    return {
      success: true,
      user: {
        ...MOCK_USER,
        email: payload.email,
      },
      token: MOCK_TOKEN,
    };
  }

  return {
    success: false,
    error: 'Credenciales inválidas',
  };
}

/**
 * REGISTER
 * --------
 * Crea una nueva cuenta de usuario.
 *
 * @param payload - Datos del nuevo usuario (nombre, email, password, phone?)
 * @returns AuthResponse con usuario y token si es exitoso
 *
 * TODO Backend: Reemplazar con llamada real a POST /api/auth/register
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  await simulateNetworkDelay();

  // MOCK: Simula registro exitoso siempre
  // TODO: Reemplazar con creación real en el backend

  // Validación básica del email (simulada)
  if (!payload.email.includes('@')) {
    return {
      success: false,
      error: 'El email no es válido',
    };
  }

  // Validación de contraseña mínima
  if (payload.password.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres',
    };
  }

  return {
    success: true,
    user: {
      id: `user-${Date.now()}`,
      email: payload.email,
      name: payload.name,
      phone: payload.phone,
    },
    token: MOCK_TOKEN,
  };
}

/**
 * LOGOUT
 * ------
 * Cierra la sesión del usuario actual.
 *
 * TODO Backend: Reemplazar con llamada real a POST /api/auth/logout
 * (para invalidar tokens en el servidor si es necesario)
 */
export async function logoutUser(): Promise<void> {
  await simulateNetworkDelay();

  // MOCK: Solo simula el logout
  // TODO: Invalidar token en el backend, limpiar cookies, etc.

  // Limpiar localStorage si se usa para persistencia
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * CHECK SESSION
 * -------------
 * Verifica si hay una sesión activa (token válido).
 * Útil para restaurar sesión al cargar la app.
 *
 * @returns AuthResponse con usuario si la sesión es válida
 *
 * TODO Backend: Reemplazar con llamada real a GET /api/auth/me
 */
export async function checkSession(): Promise<AuthResponse> {
  await simulateNetworkDelay();

  // MOCK: Verificar si hay datos guardados en localStorage
  // TODO: Validar token real con el backend

  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        return {
          success: true,
          user,
          token: storedToken,
        };
      } catch {
        // JSON inválido, limpiar
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }

  return {
    success: false,
    error: 'No hay sesión activa',
  };
}

/**
 * PERSIST SESSION
 * ---------------
 * Guarda la sesión en localStorage para persistencia.
 *
 * @param user - Usuario autenticado
 * @param token - Token de sesión
 *
 * TODO Backend: Considerar usar httpOnly cookies en lugar de localStorage
 * para mayor seguridad en producción.
 */
export function persistSession(user: User, token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
}

/**
 * CLEAR SESSION
 * -------------
 * Limpia los datos de sesión guardados.
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}
