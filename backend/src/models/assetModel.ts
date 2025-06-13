/**
 * Modelo de datos para Activo financiero
 */
export interface Asset {
  id?: number;
  name: string;
  category_id: number;
  platform?: string;
  current_value: number;
  initial_value: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Modelo para categoría de activos
 */
export interface AssetCategory {
  id?: number;
  name: string;
  target_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Modelo para valor histórico de un activo
 */
export interface AssetValue {
  id?: number;
  asset_id: number;
  value: number;
  date: string;
  created_at?: string;
}

/**
 * Modelo para resumen de activos por categoría
 */
export interface AssetSummary {
  category_name: string;
  total_value: number;
  percentage: number;
  target_percentage: number;
  deviation: number;
}

/**
 * Modelo para datos de entrada al crear un activo
 */
export interface CreateAssetDto {
  name: string;
  category_id: number;
  platform?: string;
  current_value: number;
  initial_value?: number;
  currency?: string;
}
