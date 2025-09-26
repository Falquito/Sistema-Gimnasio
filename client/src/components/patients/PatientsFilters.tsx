// components/patients/PatientsFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';


type FiltroEstado = 'todos' | 'activos' | 'inactivos';
type FiltroGenero = 'todos' | 'Femenino' | 'Masculino' | 'Otro';

interface PatientsFiltersProps {
  terminoBusqueda: string;
  filtroEstado: FiltroEstado;
  filtroGenero: FiltroGenero;
  onTerminoBusquedaChange: (value: string) => void;
  onFiltroEstadoChange: (value: FiltroEstado) => void;
  onFiltroGeneroChange: (value: FiltroGenero) => void;
}

export const PatientsFilters: React.FC<PatientsFiltersProps> = ({
  terminoBusqueda,
  filtroEstado,
  filtroGenero,
  onTerminoBusquedaChange,
  onFiltroEstadoChange,
  onFiltroGeneroChange
}) => {
  // Debug: ver qué valores llegan
  console.log('PatientsFilters values:', {
    terminoBusqueda,
    filtroEstado,
    filtroGenero
  });

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FiltroEstado;
    console.log('Estado changed to:', value);
    onFiltroEstadoChange(value);
  };

  const handleGeneroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FiltroGenero;
    console.log('Genero changed to:', value);
    onFiltroGeneroChange(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search changed to:', value);
    onTerminoBusquedaChange(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-6">
        {/* Buscador */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Buscar pacientes
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={terminoBusqueda}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, DNI o email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm hover:border-gray-400"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 ml-auto">
          <div className="w-36">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={handleEstadoChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white text-sm hover:border-gray-400 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          <div className="w-36">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Género
            </label>
            <select
              value={filtroGenero}
              onChange={handleGeneroChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white text-sm hover:border-gray-400 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};