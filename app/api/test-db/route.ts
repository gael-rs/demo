import { NextResponse } from 'next/server';
import { prisma } from '@/app/shared/lib/prisma';

/**
 * GET /api/test-db
 * Prueba de conexión a la base de datos
 */
export async function GET() {
  try {
    // Test 1: Verificar que Prisma está inicializado
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Prisma client no está inicializado',
      }, { status: 500 });
    }

    // Test 2: Ejecutar una query simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // Test 3: Contar propiedades
    const propertiesCount = await prisma.properties.count();

    return NextResponse.json({
      success: true,
      message: 'Conexión a BD exitosa',
      tests: {
        prismaInitialized: true,
        rawQueryWorks: true,
        propertiesCount,
      },
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
      },
    });
  } catch (error) {
    console.error('Error en test de BD:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
      },
    }, { status: 500 });
  }
}
