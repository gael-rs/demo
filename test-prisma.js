// Test script para verificar la conexión de Prisma con Supabase
import { prisma } from './app/lib/prisma.ts';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');

    // Test simple: contar usuarios
    const userCount = await prisma.public_users.count();
    console.log('✅ Conexión exitosa!');
    console.log(`📊 Total de usuarios en la BD: ${userCount}`);

    // Test: listar propiedades
    const properties = await prisma.properties.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        city: true,
        is_active: true,
      }
    });
    console.log(`📊 Propiedades encontradas: ${properties.length}`);

    if (properties.length > 0) {
      console.log('\n🏠 Primeras propiedades:');
      properties.forEach(p => {
        console.log(`  - ${p.name} (${p.city}) - Activa: ${p.is_active}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Conexión cerrada');
  }
}

testConnection();
