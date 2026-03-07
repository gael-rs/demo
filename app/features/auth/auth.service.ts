/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN - HOMESTED
 * ============================================
 *
 * Integración con Supabase Auth para login, registro y gestión de sesiones.
 *
 * ============================================
 */

import { LoginPayload, RegisterPayload, AuthResponse } from '@/app/types';
import { supabase } from '@/app/shared/lib/supabase';

/**
 * HELPER: Traducir errores de Supabase al español
 */
function translateSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Credenciales inválidas',
    'User already registered': 'Este email ya está registrado',
    'Email not confirmed': 'El email no ha sido confirmado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Invalid email': 'El email no es válido',
    'Email rate limit exceeded': 'Demasiados intentos. Intenta más tarde.',
    'Signup requires a valid password': 'La contraseña no es válida',
  };

  // Buscar coincidencia parcial en el mensaje
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Si no hay traducción específica, retornar mensaje original o genérico
  return message || 'Error desconocido';
}

/**
 * LOGIN
 * -----
 * Autentica un usuario existente con Supabase.
 *
 * @param payload - Email y contraseña del usuario
 * @returns AuthResponse con usuario y token si es exitoso
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      return {
        success: false,
        error: translateSupabaseError(error.message),
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: 'Error al iniciar sesión',
      };
    }

    // Obtener perfil completo del usuario desde el servidor
    const sessionResponse = await checkSession();

    if (!sessionResponse.success || !sessionResponse.user) {
      return {
        success: false,
        error: 'Error al cargar perfil de usuario',
      };
    }

    return {
      success: true,
      user: sessionResponse.user,
      token: data.session.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión. Intenta de nuevo.',
    };
  }
}

/**
 * REGISTER
 * --------
 * Crea una nueva cuenta de usuario con Supabase.
 *
 * @param payload - Datos del nuevo usuario (nombre, email, password, phone?)
 * @returns AuthResponse con usuario y token si es exitoso
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          phone: payload.phone,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: translateSupabaseError(error.message),
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: 'Error al crear cuenta',
      };
    }

    // Obtener perfil completo del usuario desde el servidor
    const sessionResponse = await checkSession();

    if (!sessionResponse.success || !sessionResponse.user) {
      return {
        success: false,
        error: 'Error al cargar perfil de usuario',
      };
    }

    return {
      success: true,
      user: sessionResponse.user,
      token: data.session.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión. Intenta de nuevo.',
    };
  }
}

/**
 * LOGOUT
 * ------
 * Cierra la sesión del usuario actual con Supabase.
 * Supabase limpia automáticamente el localStorage.
 */
export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignorar errores de logout
    // Supabase limpia automáticamente su localStorage
  }
}

/**
 * CHECK SESSION
 * -------------
 * Verifica si hay una sesión activa.
 * OPTIMIZADO: Usa Route Handler que hace todo en una sola llamada
 *
 * @returns AuthResponse con usuario si la sesión es válida
 */
export async function checkSession(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para enviar cookies
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'No hay sesión activa',
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking session:', error);
    return {
      success: false,
      error: 'Error al verificar sesión',
    };
  }
}

/**
 * NOTA SOBRE PERSISTENCIA:
 * -----------------------
 * Supabase maneja automáticamente la persistencia del JWT en localStorage.
 * Guarda: access_token, refresh_token, expires_at, y user metadata.
 * No es necesario duplicar esta funcionalidad manualmente.
 *
 * La clave de localStorage que usa Supabase es:
 * sb-<project-ref>-auth-token
 *
 * TODO Backend: Para producción, considerar configurar Supabase con
 * httpOnly cookies para mayor seguridad.
 */
