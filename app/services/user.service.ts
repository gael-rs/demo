/**
 * ============================================
 * SERVICIO DE USUARIO - HOMESTED
 * ============================================
 *
 * Gestión de perfiles de usuario en la tabla public.users.
 * Separado de auth.service para mantener responsabilidades claras.
 *
 * ============================================
 */

import { supabase } from '../lib/supabase';
import { User } from '../types';

/**
 * Obtener perfil de usuario desde public.users
 *
 * @param userId - UUID del usuario
 * @returns User object o null si no existe
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
    };
  } catch {
    return null;
  }
}

/**
 * Actualizar perfil de usuario
 *
 * @param userId - UUID del usuario
 * @param updates - Campos a actualizar (name, phone)
 * @returns true si fue exitoso, false si falló
 */
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; phone?: string }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Sincronizar datos del usuario autenticado con public.users
 *
 * Fallback para casos donde el registro falla y no se crea en public.users.
 * Esto puede ocurrir si el trigger falla por problemas de red o configuración.
 */
export async function syncUserProfile(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Verificar si ya existe en public.users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    // Si no existe, crearlo manualmente
    if (!existingUser) {
      await supabase.from('users').insert({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone,
      });
    }
  } catch {
    // Silenciar errores de sincronización
  }
}
