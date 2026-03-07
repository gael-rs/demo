import { supabase } from '@/app/shared/lib/supabase';

export interface AccessCode {
  id: string;
  booking_id: string;
  property_id: string;
  code: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  revoked_at: string | null;
  revoked_by: string | null;
  tuya_lock_id: string | null;
  tuya_response: any;
  lock_password_id?: string;
  lock_sync_status: 'pending' | 'synced' | 'failed' | 'simulated';
  lock_error?: string;
  lock_synced_at?: string;
  created_at: string;
  updated_at: string;
  // Relaciones
  booking?: any;
  property?: any;
}

/**
 * Generar código de 6 dígitos numérico (simulado)
 */
const generateSimulatedCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generar código de acceso para una reserva
 */
export const generateAccessCode = async (
  bookingId: string,
  propertyId: string,
  validFrom: string,
  validUntil: string
): Promise<AccessCode> => {
  const code = generateSimulatedCode();

  // @ts-ignore - Supabase type issue with access_codes table
  const { data, error } = await supabase
    .from('access_codes')
    .insert({
      booking_id: bookingId,
      property_id: propertyId,
      code,
      valid_from: validFrom,
      valid_until: validUntil,
      is_active: true,
      lock_sync_status: 'simulated' as const,
    })
    .select()
    .single();

  if (error) {
    console.error('Error generating access code:', error);
    throw error;
  }

  return data;
};

/**
 * Obtener código de acceso para una reserva
 */
export const getAccessCodeForBooking = async (
  bookingId: string
): Promise<AccessCode | null> => {
  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No se encontró código
      return null;
    }
    console.error('Error fetching access code:', error);
    throw error;
  }

  return data;
};

/**
 * Obtener todos los códigos de acceso (admin)
 */
export const getAllAccessCodes = async (): Promise<AccessCode[]> => {
  const { data, error } = await supabase
    .from('access_codes')
    .select(`
      *,
      booking:bookings(*, user:users(*)),
      property:properties(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all access codes:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener códigos de acceso activos
 */
export const getActiveAccessCodes = async (): Promise<AccessCode[]> => {
  const { data, error } = await supabase
    .from('access_codes')
    .select(`
      *,
      booking:bookings(*),
      property:properties(*)
    `)
    .eq('is_active', true)
    .order('valid_until', { ascending: true });

  if (error) {
    console.error('Error fetching active access codes:', error);
    throw error;
  }

  return data || [];
};

/**
 * Revocar código de acceso (admin)
 */
export const revokeAccessCode = async (
  codeId: string,
  adminId: string
): Promise<AccessCode> => {
  // @ts-ignore - Supabase type issue with access_codes table
  const { data, error } = await supabase
    .from('access_codes')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_by: adminId,
    })
    .eq('id', codeId)
    .select()
    .single();

  if (error) {
    console.error('Error revoking access code:', error);
    throw error;
  }

  return data;
};

/**
 * Extender validez de código de acceso (admin)
 */
export const extendAccessCode = async (
  codeId: string,
  newValidUntil: string
): Promise<AccessCode> => {
  const { data, error } = await supabase
    .from('access_codes')
    .update({
      valid_until: newValidUntil,
    })
    .eq('id', codeId)
    .select()
    .single();

  if (error) {
    console.error('Error extending access code:', error);
    throw error;
  }

  return data;
};

/**
 * Regenerar código de acceso
 */
export const regenerateAccessCode = async (codeId: string): Promise<AccessCode> => {
  const newCode = generateSimulatedCode();

  const { data, error } = await supabase
    .from('access_codes')
    .update({
      code: newCode,
    })
    .eq('id', codeId)
    .select()
    .single();

  if (error) {
    console.error('Error regenerating access code:', error);
    throw error;
  }

  return data;
};

/**
 * Verificar si un código es válido
 */
export const verifyAccessCode = async (code: string): Promise<boolean> => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .lte('valid_from', now)
    .gte('valid_until', now)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false; // Código no encontrado o no válido
    }
    console.error('Error verifying access code:', error);
    return false;
  }

  return !!data;
};

/**
 * Eliminar código de acceso por booking_id
 */
export const deleteAccessCodeByBookingId = async (
  bookingId: string
): Promise<void> => {
  const { error } = await supabase
    .from('access_codes')
    .delete()
    .eq('booking_id', bookingId);

  if (error) {
    console.error('Error deleting access code by booking:', error);
    throw error;
  }
};
