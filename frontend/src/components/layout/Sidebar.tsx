import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CogIcon,
  ChartPieIcon,
  UserIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import type { NavItem } from '../../types';

interface SidebarProps {
  className?: string;
}

// Definir las secciones de navegación
const mainNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Activos', href: '/assets', icon: ChartBarIcon },
];

const analysisNavigation: NavItem[] = [
  { name: 'Rendimiento', href: '/performance', icon: ArrowTrendingUpIcon },
  { name: 'Distribución', href: '/distribution', icon: ChartPieIcon },
];

const settingsNavigation: NavItem[] = [
  { name: 'Perfil', href: '/profile', icon: UserIcon },
  { name: 'Configuración', href: '/settings', icon: CogIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  // Función para renderizar un grupo de navegación
  const renderNavGroup = (items: NavItem[], title?: string) => (
    <div className="mb-6">
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon!;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn('w-64 bg-white border-r border-gray-200', className)}>
      <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-bold text-gray-900">FinTrack AI</h1>
        </div>
        
        {/* Navegación */}
        <div className="mt-5 flex-1 flex flex-col px-2">
          {renderNavGroup(mainNavigation, 'Principal')}
          {renderNavGroup(analysisNavigation, 'Análisis')}
          {renderNavGroup(settingsNavigation, 'Configuración')}
        </div>
        
        {/* Footer del sidebar */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">FinTrack AI</p>
              <p className="text-xs font-medium text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
