/**
 * Tipos de datos para FinTrack AI Frontend
 * Basados en los modelos del backend
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

export interface AssetCategory {
  id?: number;
  name: string;
  target_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AssetValue {
  id?: number;
  asset_id: number;
  value: number;
  date: string;
  created_at?: string;
}

export interface AssetSummary {
  category_name: string;
  total_value: number;
  percentage: number;
  target_percentage: number;
  deviation: number;
}

export interface CreateAssetDto {
  name: string;
  category_id: number;
  platform?: string;
  current_value: number;
  initial_value?: number;
  currency?: string;
}

export interface UpdateAssetDto {
  name?: string;
  category_id?: number;
  platform?: string;
  current_value?: number;
  initial_value?: number;
  currency?: string;
}

// Tipos para la UI
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Tipos para el estado de la aplicación
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Tipos para formularios
export interface AssetFormData {
  name: string;
  category_id: number;
  platform: string;
  current_value: number;
  initial_value: number;
  currency: string;
}

// Tipos para navegación
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Tipos para dashboard
export interface DashboardStats {
  totalValue: number;
  totalAssets: number;
  totalCategories: number;
  performancePercentage: number;
}
