// components/SearchFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';
import type { FilterState } from '../../types/dashboard';

interface SearchFiltersProps {
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onSearchChange,
  onStatusChange
}) => {
  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por miembro, entrenador o tipo de sesión..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filters.statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-green-500/50 backdrop-blur-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendiente">Pendientes</option>
            <option value="completado">Completados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>
    </div>
  );
};