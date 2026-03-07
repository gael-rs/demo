import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/app/shared/lib/supabase-server';

/**
 * GET /api/auth/session
 * Obtiene la sesión actual del usuario.
 *
 * IMPORTANTE: Solo usa Supabase SSR (sin Prisma) para máxima disponibilidad.
 * Prisma requiere DATABASE_URL que puede no estar en producción,
 * mientras que Supabase solo necesita las variables NEXT_PUBLIC_*.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Verificar sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    // 2. Leer perfil completo (incluyendo role) usando service role key para bypasear RLS
    const serviceClient = createServiceSupabaseClient();
    const { data: userProfile, error: profileError } = await serviceClient
      .from('users')
      .select('id, email, name, phone, role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile) {
      // Si no existe en public.users, lo creamos (fallback)
      const { data: newUser, error: createError } = await serviceClient
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          phone: session.user.user_metadata?.phone || null,
          role: 'user',
        })
        .select('id, email, name, phone, role')
        .single();

      if (createError || !newUser) {
        console.error('Error creating user profile:', createError);
        // Último fallback: retornar datos mínimos desde Supabase Auth
        return NextResponse.json({
          success: true,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            phone: null,
            role: 'user',
          },
          token: session.access_token,
        });
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        token: session.access_token,
      });
    }

    return NextResponse.json({
      success: true,
      user: userProfile,
      token: session.access_token,
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { success: false, error: 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}
