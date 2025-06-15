import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { Asset, AssetCategory } from '../types';
import { assetService, handleApiError } from '../services/api';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener datos con manejo de errores mejorado
      const assetsData = await assetService.getAllAssets();
      const categoriesData = await assetService.getAllCategories();
      
      // Verificar que los datos son arrays válidos
      if (!Array.isArray(assetsData)) {
        console.error('La API no devolvió un array de activos:', assetsData);
        setAssets([]);
      } else {
        setAssets(assetsData);
      }
      
      if (!Array.isArray(categoriesData)) {
        console.error('La API no devolvió un array de categorías:', categoriesData);
        setCategories([]);
      } else {
        setCategories(categoriesData);
      }
      
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(handleApiError(err));
      // Inicializar con arrays vacíos en caso de error
      setAssets([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    // Verificar que assets es un array
    if (!Array.isArray(assets)) {
      setFilteredAssets([]);
      return;
    }
    
    let filtered = [...assets];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.platform?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category_id === parseInt(selectedCategory));
    }

    setFilteredAssets(filtered);
  };

  const handleDeleteAsset = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este activo?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await assetService.deleteAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const getPerformance = (asset: Asset) => {
    const performance = ((asset.current_value - asset.initial_value) / asset.initial_value) * 100;
    return performance;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadData}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activos</h1>
          <p className="text-gray-600">Gestiona tu cartera de inversiones</p>
        </div>
        <Button>
          Nuevo Activo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar activos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Assets List */}
      <Card>
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {assets.length === 0 ? (
                <>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay activos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza añadiendo tu primer activo a la cartera.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron activos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Intenta cambiar los filtros de búsqueda.
                  </p>
                </>
              )}
            </div>
            {assets.length === 0 && (
              <Button>
                Añadir Primer Activo
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Inicial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => {
                  const performance = getPerformance(asset);
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          {asset.currency && (
                            <div className="text-sm text-gray-500">{asset.currency}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryName(asset.category_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.platform || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(asset.initial_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(asset.current_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          performance >= 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Editar
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteAsset(asset.id!)}
                          >
                            {deleteLoading === asset.id ? 'Eliminando...' : 'Eliminar'}

                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Summary */}
      {filteredAssets.length > 0 && (
        <Card title="Resumen">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredAssets.length}
              </p>
              <p className="text-sm text-gray-500">Activos mostrados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(Array.isArray(filteredAssets) ? filteredAssets.reduce((sum, asset) => sum + asset.current_value, 0) : 0)}
              </p>
              <p className="text-sm text-gray-500">Valor total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(Array.isArray(filteredAssets) ? filteredAssets.reduce((sum, asset) => sum + asset.initial_value, 0) : 0)}
              </p>
              <p className="text-sm text-gray-500">Inversión inicial</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Assets;