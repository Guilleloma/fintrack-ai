import request from 'supertest';
import { getDatabase, initializeDatabase, closeDatabase } from '../../db/database';
import { app } from '../../index';
import { Asset } from '../../models/assetModel';

// Log para verificar si los tests se están ejecutando
console.log('Iniciando tests de API de Activos');

describe('API de Activos', () => {
  // Para almacenar el ID del activo creado en las pruebas
  let createdAssetId: number;

  // Configuración antes de todas las pruebas
  beforeAll(async () => {
    // Inicializar la base de datos para pruebas
    console.log('Inicializando base de datos para tests');
    await initializeDatabase();
    console.log('Base de datos inicializada correctamente');
  });

  // Limpieza después de todas las pruebas
  afterAll(async () => {
    // Eliminar activos de prueba y cerrar la conexión
    console.log('Limpiando datos de prueba');
    if (createdAssetId) {
      const db = await getDatabase();
      try {
        await db.run('DELETE FROM asset_values WHERE asset_id = ?', [createdAssetId]);
        await db.run('DELETE FROM assets WHERE id = ?', [createdAssetId]);
        console.log(`Datos de prueba eliminados correctamente: Asset ID ${createdAssetId}`);
      } catch (error) {
        console.error('Error al limpiar datos de prueba:', error);
      }
    }
    await closeDatabase();
    console.log('Conexión a base de datos cerrada');
  }, 10000);

  // Test para crear un nuevo activo
  describe('POST /api/assets', () => {
    it('debería crear un nuevo activo', async () => {
      const newAsset = {
        name: 'Depósito Test',
        category_id: 1, // Efectivo (asumiendo que existe por el seed)
        platform: 'Banco Test',
        current_value: 5000,
        currency: 'EUR'
      };

      const response = await request(app)
        .post('/api/assets')
        .send(newAsset)
        .expect('Content-Type', /json/)
        .expect(201);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newAsset.name);
      expect(response.body.data.current_value).toBe(newAsset.current_value);

      // Guardar el ID para usarlo en otras pruebas
      createdAssetId = response.body.data.id;
    });

    it('debería validar los datos de entrada', async () => {
      const invalidAsset = {
        // Sin nombre (obligatorio)
        category_id: 1,
        current_value: -100 // Valor negativo (inválido)
      };

      const response = await request(app)
        .post('/api/assets')
        .send(invalidAsset)
        .expect('Content-Type', /json/)
        .expect(400);

      // Verificar la respuesta de error
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  // Test para obtener todos los activos
  describe('GET /api/assets', () => {
    it('debería obtener todos los activos', async () => {
      const response = await request(app)
        .get('/api/assets')
        .expect('Content-Type', /json/)
        .expect(200);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // El activo creado en la prueba anterior debería estar en la lista
      const found = response.body.data.some((asset: Asset) => asset.id === createdAssetId);
      expect(found).toBe(true);
    });
  });

  // Test para obtener un activo por ID
  describe('GET /api/assets/:id', () => {
    it('debería obtener un activo por ID', async () => {
      const response = await request(app)
        .get(`/api/assets/${createdAssetId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdAssetId);
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = 9999;
      
      const response = await request(app)
        .get(`/api/assets/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      // Verificar la respuesta de error
      expect(response.body.success).toBe(false);
    });
  });

  // Test para actualizar un activo
  describe('PUT /api/assets/:id', () => {
    it('debería actualizar un activo existente', async () => {
      const updateData = {
        name: 'Depósito Test Actualizado',
        current_value: 6000
      };

      const response = await request(app)
        .put(`/api/assets/${createdAssetId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.current_value).toBe(updateData.current_value);
    });
  });

  // Test para obtener categorías
  describe('GET /api/assets/categories/all', () => {
    it('debería obtener todas las categorías', async () => {
      const response = await request(app)
        .get('/api/assets/categories/all')
        .expect('Content-Type', /json/)
        .expect(200);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  // Test para eliminar un activo
  // Este test debe ejecutarse al final para no afectar otros tests
  describe('DELETE /api/assets/:id', () => {
    it('debería eliminar un activo existente', async () => {
      const response = await request(app)
        .delete(`/api/assets/${createdAssetId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Verificar la respuesta
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminado');

      // Verificar que el activo ya no existe
      const getResponse = await request(app)
        .get(`/api/assets/${createdAssetId}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });
  });
});
