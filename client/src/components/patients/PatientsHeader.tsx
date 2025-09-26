// components/patients/PatientsHeader.tsx
import React from 'react';
import { Users, Plus } from 'lucide-react';

interface PatientsHeaderProps {
  totalPacientes: number;
  pacientesActivos: number;
  pacientesConObraSocial: number;
  onNuevoPaciente: () => void;
}

export const PatientsHeader: React.FC<PatientsHeaderProps> = ({
  totalPacientes,
  pacientesActivos,
  pacientesConObraSocial,
  onNuevoPaciente
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm  rounded-3xl">
      <div className="max-w-7xl mx-auto px-6 py-6  rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">Gestión de Pacientes</h1>
              <p className="text-gray-600 text-sm">Administración del registro médico</p>
            </div>
          </div>

       

          {/* Botón nuevo paciente */}
          <button
            onClick={onNuevoPaciente}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </button>
        </div>
      </div>
    </div>
  );
};