import { Router } from 'express';
import { AssetController } from '../controllers/assetController';
import { check } from 'express-validator';

const router = Router();

/**
 * Validaciones para creación y actualización de activos
 */
const assetCreateValidations = [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('category_id', 'La categoría es obligatoria y debe ser un número').isInt(),
  check('current_value', 'El valor actual es obligatorio y debe ser un número').isFloat({ min: 0 }),
  check('initial_value', 'El valor inicial debe ser un número positivo').optional().isFloat({ min: 0 }),
  check('currency', 'La moneda debe ser una cadena de caracteres válida').optional().isString()
];

const assetUpdateValidations = [
  check('name', 'El nombre debe ser una cadena de caracteres').optional().isString(),
  check('category_id', 'La categoría debe ser un número').optional().isInt(),
  check('platform', 'La plataforma debe ser una cadena de caracteres').optional().isString(),
  check('current_value', 'El valor actual debe ser un número positivo').optional().isFloat({ min: 0 }),
  check('initial_value', 'El valor inicial debe ser un número positivo').optional().isFloat({ min: 0 }),
  check('currency', 'La moneda debe ser una cadena de caracteres válida').optional().isString()
];

/**
 * @route   GET /api/assets
 * @desc    Obtener todos los activos
 * @access  Public
 */
router.get('/', AssetController.getAllAssets);

/**
 * @route   GET /api/assets/:id
 * @desc    Obtener un activo por ID
 * @access  Public
 */
router.get('/:id', AssetController.getAssetById);

/**
 * @route   POST /api/assets
 * @desc    Crear un nuevo activo
 * @access  Public
 */
router.post('/', assetCreateValidations, AssetController.createAsset);

/**
 * @route   PUT /api/assets/:id
 * @desc    Actualizar un activo existente
 * @access  Public
 */
router.put('/:id', assetUpdateValidations, AssetController.updateAsset);

/**
 * @route   DELETE /api/assets/:id
 * @desc    Eliminar un activo
 * @access  Public
 */
router.delete('/:id', AssetController.deleteAsset);

/**
 * @route   GET /api/assets/categories
 * @desc    Obtener todas las categorías de activos
 * @access  Public
 */
router.get('/categories/all', AssetController.getAllCategories);

export default router;
