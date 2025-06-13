import { initializeDatabase, closeDatabase, getDatabase } from '../db/database';

describe('Test simple de base de datos', () => {
  beforeAll(async () => {
    console.log('Inicializando BD...');
    await initializeDatabase();
    console.log('BD inicializada');
  });

  afterAll(async () => {
    console.log('Cerrando BD...');
    await closeDatabase();
    console.log('BD cerrada');
  });

  it('debería conectar y consultar la base de datos', async () => {
    console.log('Ejecutando test de consulta...');
    const db = await getDatabase();
    const categories = await db.all('SELECT * FROM asset_categories LIMIT 1');
    console.log('Categorías encontradas:', categories.length);
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    console.log('Test completado exitosamente');
  });
});
