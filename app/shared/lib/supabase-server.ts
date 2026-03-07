import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Cliente de Supabase con Service Role Key — bypasea RLS.
 * Solo usar en rutas de servidor donde se necesita acceso completo a la BD.
 */
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Cliente de Supabase para Route Handlers (Server-Side)
 *
 * IMPORTANTE: Solo usar en route handlers de Next.js (app/api/*)
 * Para componentes de servidor usar este mismo patrón pero directamente en el componente.
 * Para el navegador, usar el cliente de app/lib/supabase.ts
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignorar errores de cookies en route handlers
        }
      },
    },
  });
}
