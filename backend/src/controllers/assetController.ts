import { Request, Response } from 'express';
import { AssetService } from '../services/assetService';
import { CreateAssetDto } from '../models/assetModel';
import { validationResult } from 'express-validator';

/**
 * Controlador para gestionar las operaciones de activos financieros
 */
export class AssetController {
  
  /**
   * Obtiene todos los activos
   */
  static async getAllAssets(req: Request, res: Response): Promise<void> {
    try {
      const assets = await AssetService.getAllAssets();
      
      // Calcular ganancia/pérdida para cada activo
      const assetsWithGainLoss = assets.map(asset => ({
        ...asset,
        gain_loss: AssetService.calculateGainLoss(asset)
      }));
      
      res.status(200).json({
        success: true,
        data: assetsWithGainLoss
      });
    } catch (error) {
      console.error('Error al obtener activos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los activos',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Obtiene un activo por su ID
   */
  static async getAssetById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de activo no válido'
        });
        return;
      }
      
      const asset = await AssetService.getAssetById(id);
      
      if (!asset) {
        res.status(404).json({
          success: false,
          message: `Activo con ID ${id} no encontrado`
        });
        return;
      }
      
      // Calcular ganancia/pérdida
      const assetWithGainLoss = {
        ...asset,
        gain_loss: AssetService.calculateGainLoss(asset)
      };
      
      // Obtener el historial de valores
      const history = await AssetService.getAssetHistory(id);
      
      res.status(200).json({
        success: true,
        data: {
          ...assetWithGainLoss,
          history
        }
      });
    } catch (error) {
      console.error(`Error al obtener activo por ID:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el activo',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Crea un nuevo activo
   */
  static async createAsset(req: Request, res: Response): Promise<void> {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
        return;
      }
      
      const assetData: CreateAssetDto = {
        name: req.body.name,
        category_id: parseInt(req.body.category_id, 10),
        platform: req.body.platform,
        current_value: parseFloat(req.body.current_value),
        initial_value: req.body.initial_value ? parseFloat(req.body.initial_value) : undefined,
        currency: req.body.currency
      };
      
      const newAsset = await AssetService.createAsset(assetData);
      
      res.status(201).json({
        success: true,
        message: 'Activo creado con éxito',
        data: newAsset
      });
    } catch (error) {
      console.error('Error al crear activo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el activo',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Actualiza un activo existente
   */
  static async updateAsset(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de activo no válido'
        });
        return;
      }
      
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
        return;
      }
      
      const updateData: any = {};
      
      // Solo incluir campos proporcionados en la solicitud
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.category_id !== undefined) updateData.category_id = parseInt(req.body.category_id, 10);
      if (req.body.platform !== undefined) updateData.platform = req.body.platform;
      if (req.body.current_value !== undefined) updateData.current_value = parseFloat(req.body.current_value);
      if (req.body.initial_value !== undefined) updateData.initial_value = parseFloat(req.body.initial_value);
      if (req.body.currency !== undefined) updateData.currency = req.body.currency;
      
      const updatedAsset = await AssetService.updateAsset(id, updateData);
      
      if (!updatedAsset) {
        res.status(404).json({
          success: false,
          message: `Activo con ID ${id} no encontrado`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Activo actualizado con éxito',
        data: updatedAsset
      });
    } catch (error) {
      console.error('Error al actualizar activo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el activo',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Elimina un activo
   */
  static async deleteAsset(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de activo no válido'
        });
        return;
      }
      
      const deleted = await AssetService.deleteAsset(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Activo con ID ${id} no encontrado`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Activo eliminado con éxito'
      });
    } catch (error) {
      console.error('Error al eliminar activo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el activo',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Obtiene todas las categorías de activos
   */
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await AssetService.getAllCategories();
      
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: (error as Error).message
      });
    }
  }
}
