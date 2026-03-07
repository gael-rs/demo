import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

/**
 * Cliente de Supabase para el navegador (Browser)
 *
 * IMPORTANTE: Usa createBrowserClient de @supabase/ssr en lugar de createClient
 * Esto sincroniza automáticamente la sesión entre cliente y servidor usando cookies.
 *
 * - Las cookies se comparten entre cliente y servidor
 * - El servidor (api/auth/session) puede leer las mismas cookies
 * - Resuelve el problema de 401 al hacer login
 */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

// Instancia singleton para usar en el cliente
export const supabase = createClient();
