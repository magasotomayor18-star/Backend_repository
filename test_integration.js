import Database from './models/database/Database.js';
import ProductoFactory from './models/factories/ProductoFactory.js';

async function testBackendWithPrisma() {
  console.log('--- Iniciando prueba de integración del Backend con PRISMA ORM ---');
  
  // 1. Probar Singleton de Database con Prisma
  const db1 = Database.getInstance();
  const db2 = Database.getInstance();
  console.log('¿Es Database (PrismaClient) un Singleton exacto?:', db1 === db2 ? '✅ SÍ' : '❌ NO');

  // 2. Probar Factory
  const repo = ProductoFactory.createRepository();
  const controller = ProductoFactory.createController();
  console.log('¿Factory crea repositorio y controlador con Prisma correctamente?:', (repo && controller) ? '✅ SÍ' : '❌ NO');

  // 3. Probar Repository usando Prisma sobre los 10.000 productos
  try {
    const { total, items } = await repo.findAll({ limit: 3, offset: 0 });
    console.log(`¿Total de productos consultados con Prisma count()?: ${total} (esperado 10000)`);
    console.log('Primer producto obtenido con Prisma:', items[0]);

    const p1 = await repo.findById(1);
    console.log('Búsqueda por ID 1 con Prisma findUnique():', p1 ? `✅ Encontrado: ${p1.nombre}` : '❌ No encontrado');
  } catch (err) {
    console.error('Error en prueba con Prisma ORM:', err);
  } finally {
    await db1.close();
    console.log('--- Prueba finalizada exitosamente ---');
  }
}

testBackendWithPrisma();
