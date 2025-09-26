// components/SearchFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';
import type { FilterState, StatusFilter } from '../../types/dashboard';

interface SearchFiltersProps {
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onSearchChange,
  onStatusChange
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Buscador */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por paciente, Profesional o tipo de sesión..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-gray-900 placeholder-gray-400 transition-all duration-200"
          />
        </div>

        {/* Estado */}
        <div className="flex items-center space-x-4">
          <select
            value={filters.statusFilter}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
          >
            <option value="todos">Todos</option>
            <option value="PROGRAMADO">Programados</option>
            <option value="COMPLETADO">Completados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>
      </div>
    </div>
  );
};