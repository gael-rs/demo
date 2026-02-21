import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase-server';

export async function GET() {
  try {
    // Crear cliente de Supabase para server-side
    const supabase = await createServerSupabaseClient();

    // Intenta obtener la sesión actual como prueba de conexión
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Error al conectar con Supabase',
          error: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Conexión con Supabase establecida correctamente',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      session: data.session ? 'activa' : 'sin sesión'
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error inesperado',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
