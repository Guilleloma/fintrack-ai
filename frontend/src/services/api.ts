import axios, { type AxiosResponse } from 'axios';
import type { Asset, AssetCategory, CreateAssetDto, UpdateAssetDto } from '../types';

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios para Assets
export const assetService = {
  // Obtener todos los activos
  async getAllAssets(): Promise<Asset[]> {
    try {
      const response: AxiosResponse<Asset[]> = await api.get('/assets');
      // Verificar que la respuesta es un array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return []; // Devolver array vacío en caso de error
    }
  },

  // Obtener un activo por ID
  async getAssetById(id: number): Promise<Asset> {
    const response: AxiosResponse<Asset> = await api.get(`/assets/${id}`);
    return response.data;
  },

  // Crear un nuevo activo
  async createAsset(assetData: CreateAssetDto): Promise<Asset> {
    const response: AxiosResponse<Asset> = await api.post('/assets', assetData);
    return response.data;
  },

  // Actualizar un activo existente
  async updateAsset(id: number, assetData: UpdateAssetDto): Promise<Asset> {
    const response: AxiosResponse<Asset> = await api.put(`/assets/${id}`, assetData);
    return response.data;
  },

  // Eliminar un activo
  async deleteAsset(id: number): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  // Obtener todas las categorías
  async getAllCategories(): Promise<AssetCategory[]> {
    try {
      const response: AxiosResponse<AssetCategory[]> = await api.get('/assets/categories/all');
      // Verificar que la respuesta es un array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Devolver array vacío en caso de error
    }
  },
};

// Función helper para manejo de errores
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0] as string[];
    return firstError[0] || 'Error de validación';
  }
  if (error.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
};

export default api;
