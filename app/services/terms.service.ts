import { supabase } from '@/app/lib/supabase';

export interface TermsAcceptance {
  id: string;
  user_id: string;
  booking_id: string | null;
  accepted_at: string;
  ip_address: string | null;
  user_agent: string | null;
  terms_version: string;
  created_at: string;
}

/**
 * Registrar aceptación de términos y condiciones
 */
export const recordTermsAcceptance = async (
  userId: string,
  bookingId?: string
): Promise<TermsAcceptance> => {
  // Obtener IP del usuario (requiere servidor o API externa)
  let ipAddress: string | null = null;
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ipAddress = data.ip;
  } catch (error) {
    console.warn('Could not fetch IP address:', error);
  }

  const { data, error } = await supabase
    .from('terms_acceptances')
    .insert({
      user_id: userId,
      booking_id: bookingId || null,
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
      terms_version: 'v1.0',
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording terms acceptance:', error);
    throw error;
  }

  return data;
};

/**
 * Verificar si el usuario ha aceptado los términos
 */
export const hasUserAcceptedTerms = async (
  userId: string,
  version: string = 'v1.0'
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('terms_acceptances')
    .select('id')
    .eq('user_id', userId)
    .eq('terms_version', version)
    .limit(1);

  if (error) {
    console.error('Error checking terms acceptance:', error);
    return false;
  }

  return data && data.length > 0;
};

/**
 * Obtener todas las aceptaciones de un usuario
 */
export const getUserTermsAcceptances = async (
  userId: string
): Promise<TermsAcceptance[]> => {
  const { data, error } = await supabase
    .from('terms_acceptances')
    .select('*')
    .eq('user_id', userId)
    .order('accepted_at', { ascending: false });

  if (error) {
    console.error('Error fetching user terms acceptances:', error);
    throw error;
  }

  return data || [];
};
