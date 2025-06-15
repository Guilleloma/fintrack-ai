import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Asset, AssetCategory, DashboardStats } from '../types';
import { assetService, handleApiError } from '../services/api';

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: 0,
    totalAssets: 0,
    totalCategories: 0,
    performancePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assetsData, categoriesData] = await Promise.all([
        assetService.getAllAssets(),
        assetService.getAllCategories()
      ]);
      
      setAssets(assetsData);
      setCategories(categoriesData);
      
      // Calcular estadísticas
      const totalValue = assetsData.reduce((sum, asset) => sum + asset.current_value, 0);
      const totalInitialValue = assetsData.reduce((sum, asset) => sum + asset.initial_value, 0);
      const performancePercentage = totalInitialValue > 0 
        ? ((totalValue - totalInitialValue) / totalInitialValue) * 100 
        : 0;
      
      setStats({
        totalValue,
        totalAssets: assetsData.length,
        totalCategories: categoriesData.length,
        performancePercentage
      });
      
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getRecentAssets = () => {
    return assets
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 5);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-danger-600 mb-4">{error}</div>
        <Button onClick={loadDashboardData}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu cartera de inversiones</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Activo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rendimiento</p>
              <p className={`text-2xl font-bold ${
                stats.performancePercentage >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {stats.performancePercentage >= 0 ? '+' : ''}
                {stats.performancePercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Activos Recientes" subtitle="Últimos activos añadidos">
          {assets.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay activos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza añadiendo tu primer activo.
              </p>
              <div className="mt-6">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Añadir Activo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {getRecentAssets().map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{getCategoryName(asset.category_id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(asset.current_value)}
                    </p>
                    {asset.platform && (
                      <p className="text-sm text-gray-500">{asset.platform}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Distribución por Categorías" subtitle="Resumen de tu cartera">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
              <p className="mt-1 text-sm text-gray-500">
                Las categorías aparecerán cuando añadas activos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => {
                const categoryAssets = assets.filter(asset => asset.category_id === category.id);
                const categoryValue = categoryAssets.reduce((sum, asset) => sum + asset.current_value, 0);
                const percentage = stats.totalValue > 0 ? (categoryValue / stats.totalValue) * 100 : 0;
                
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(categoryValue)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
