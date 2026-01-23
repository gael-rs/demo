/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN - HOMESTED
 * ============================================
 *
 * Integración con Supabase Auth para login, registro y gestión de sesiones.
 *
 * ============================================
 */

import { LoginPayload, RegisterPayload, AuthResponse, User } from '../types';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getUserProfile, syncUserProfile } from './user.service';

/**
 * HELPER: Mapear usuario de Supabase a tipo User de la app
 * Prioriza datos de public.users sobre user_metadata
 */
async function mapSupabaseUserToAppUser(supabaseUser: SupabaseUser): Promise<User> {
  // Intentar obtener datos desde public.users
  const profile = await getUserProfile(supabaseUser.id);

  if (profile) {
    return profile;
  }

  // Fallback: usar user_metadata si no existe en public.users
  // (puede pasar durante el registro si el trigger falla)
  await syncUserProfile();

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || '',
    phone: supabaseUser.user_metadata?.phone,
  };
}

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

    const user = await mapSupabaseUserToAppUser(data.user);

    return {
      success: true,
      user,
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

    const user = await mapSupabaseUserToAppUser(data.user);

    return {
      success: true,
      user,
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
 */
export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignorar errores de logout, siempre limpiar sesión local
  } finally {
    clearSession();
  }
}

/**
 * CHECK SESSION
 * -------------
 * Verifica si hay una sesión activa en Supabase.
 * Útil para restaurar sesión al cargar la app.
 *
 * @returns AuthResponse con usuario si la sesión es válida
 */
export async function checkSession(): Promise<AuthResponse> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      clearSession();
      return {
        success: false,
        error: 'No hay sesión activa',
      };
    }

    // Obtener datos frescos del usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      clearSession();
      return {
        success: false,
        error: 'No hay sesión activa',
      };
    }

    const appUser = await mapSupabaseUserToAppUser(user);

    // Persistir sesión en localStorage
    persistSession(appUser, session.access_token);

    return {
      success: true,
      user: appUser,
      token: session.access_token,
    };
  } catch (error) {
    clearSession();
    return {
      success: false,
      error: 'Error al verificar sesión',
    };
  }
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
