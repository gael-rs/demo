import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/shared/lib/prisma';

/**
 * GET /api/properties
 * Obtiene todas las propiedades activas
 *
 * MUCHO más rápido que usar Supabase client-side porque:
 * - Conexión directa: Next.js Server → Prisma → PostgreSQL
 * - Sin saltos intermedios de red
 * - Pooling de conexiones optimizado
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const properties = await prisma.properties.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        region: true,
        base_price_clp: true,
        amenities: true,
        images: true,
        capacity: true,
        bedrooms: true,
        bathrooms: true,
        is_active: true,
        category: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(properties, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      {
        error: 'Error al cargar propiedades',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}
