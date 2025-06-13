import { Database } from 'sqlite';
import { getDatabase } from '../db/database';
import { Asset, AssetCategory, CreateAssetDto, AssetValue } from '../models/assetModel';

/**
 * Servicio para gestionar operaciones CRUD de activos
 */
export class AssetService {

  /**
   * Obtiene todos los activos registrados
   * @returns Lista de activos
   */
  static async getAllAssets(): Promise<Asset[]> {
    const db = await getDatabase();
    
    return db.all(`
      SELECT a.*, ac.name as category_name 
      FROM assets a
      JOIN asset_categories ac ON a.category_id = ac.id
      ORDER BY a.category_id, a.name
    `);
  }

  /**
   * Obtiene un activo por su ID
   * @param id ID del activo
   * @returns Activo encontrado o null
   */
  static async getAssetById(id: number): Promise<Asset | null> {
    const db = await getDatabase();
    
    const asset = await db.get(`
      SELECT a.*, ac.name as category_name 
      FROM assets a
      JOIN asset_categories ac ON a.category_id = ac.id
      WHERE a.id = ?
    `, [id]);
    
    return asset || null;
  }

  /**
   * Crea un nuevo activo
   * @param assetData Datos del nuevo activo
   * @returns Activo creado
   */
  static async createAsset(assetData: CreateAssetDto): Promise<Asset> {
    const db = await getDatabase();
    
    // Si no se proporciona valor inicial, usar el actual
    const initialValue = assetData.initial_value || assetData.current_value;
    
    const { lastID } = await db.run(`
      INSERT INTO assets (name, category_id, platform, current_value, initial_value, currency)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      assetData.name, 
      assetData.category_id,
      assetData.platform || null,
      assetData.current_value,
      initialValue,
      assetData.currency || 'EUR'
    ]);
    
    // Registrar el valor actual como histórico
    await db.run(`
      INSERT INTO asset_values (asset_id, value, date)
      VALUES (?, ?, date('now'))
    `, [lastID, assetData.current_value]);
    
    return this.getAssetById(lastID as number) as Promise<Asset>;
  }

  /**
   * Actualiza un activo existente
   * @param id ID del activo
   * @param assetData Datos actualizados
   * @returns Activo actualizado
   */
  static async updateAsset(id: number, assetData: Partial<Asset>): Promise<Asset | null> {
    const db = await getDatabase();
    
    // Verificar si el activo existe
    const existingAsset = await this.getAssetById(id);
    if (!existingAsset) return null;
    
    const updates: string[] = [];
    const values: any[] = [];
    
    // Construir la consulta dinámicamente según los campos proporcionados
    if (assetData.name !== undefined) {
      updates.push('name = ?');
      values.push(assetData.name);
    }
    
    if (assetData.category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(assetData.category_id);
    }
    
    if (assetData.platform !== undefined) {
      updates.push('platform = ?');
      values.push(assetData.platform);
    }
    
    if (assetData.current_value !== undefined) {
      updates.push('current_value = ?');
      values.push(assetData.current_value);
      
      // Registrar nuevo valor en el histórico si cambió
      if (assetData.current_value !== existingAsset.current_value) {
        await db.run(`
          INSERT INTO asset_values (asset_id, value, date)
          VALUES (?, ?, date('now'))
        `, [id, assetData.current_value]);
      }
    }
    
    if (assetData.initial_value !== undefined) {
      updates.push('initial_value = ?');
      values.push(assetData.initial_value);
    }
    
    if (assetData.currency !== undefined) {
      updates.push('currency = ?');
      values.push(assetData.currency);
    }
    
    // Solo actualizar si hay cambios
    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      
      await db.run(`
        UPDATE assets 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, [...values, id]);
    }
    
    return this.getAssetById(id);
  }

  /**
   * Elimina un activo
   * @param id ID del activo a eliminar
   * @returns true si se eliminó correctamente
   */
  static async deleteAsset(id: number): Promise<boolean> {
    const db = await getDatabase();
    
    // Verificar si el activo existe
    const existingAsset = await this.getAssetById(id);
    if (!existingAsset) return false;
    
    // Eliminar primero los registros históricos
    await db.run('DELETE FROM asset_values WHERE asset_id = ?', [id]);
    
    // Eliminar el activo
    const result = await db.run('DELETE FROM assets WHERE id = ?', [id]);
    
    return (result.changes || 0) > 0;
  }

  /**
   * Obtiene todas las categorías de activos
   * @returns Lista de categorías
   */
  static async getAllCategories(): Promise<AssetCategory[]> {
    const db = await getDatabase();
    return db.all('SELECT * FROM asset_categories ORDER BY name');
  }

  /**
   * Obtiene el historial de valores de un activo
   * @param assetId ID del activo
   * @returns Lista de valores históricos
   */
  static async getAssetHistory(assetId: number): Promise<AssetValue[]> {
    const db = await getDatabase();
    
    return db.all(`
      SELECT * FROM asset_values
      WHERE asset_id = ?
      ORDER BY date DESC
    `, [assetId]);
  }

  /**
   * Calcula la ganancia/pérdida para un activo
   * @param asset Activo a calcular
   * @returns Objeto con la ganancia absoluta y porcentual
   */
  static calculateGainLoss(asset: Asset) {
    if (!asset.initial_value || asset.initial_value === 0) {
      return { absolute: 0, percentage: 0 };
    }
    
    const absolute = asset.current_value - asset.initial_value;
    const percentage = (absolute / asset.initial_value) * 100;
    
    return {
      absolute: parseFloat(absolute.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2))
    };
  }
}
