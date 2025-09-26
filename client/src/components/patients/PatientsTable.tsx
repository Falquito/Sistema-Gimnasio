// components/patients/PatientsTable.tsx
import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Trash2, 
  Eye, 
  Users 
} from 'lucide-react';
import type { PacienteListItem } from '../../services/pacientes.services';
import type { ObraSocial } from '../../pages/Pacientes';

interface PatientsTableProps {
  pacientes: PacienteListItem[];
  obrasSociales: ObraSocial[];
  onEditar: (paciente: any) => void;
  onEliminar: (id: number) => void;
  onVerDetalles?: (paciente: any) => void;
  filtroEstado: string;
  setFiltroEstado: (estado: string) => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  pacientes,
  obrasSociales,
  onEditar,
  onEliminar,
  onVerDetalles,
  filtroEstado,
  setFiltroEstado
}) => {
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header de tabla */}
      <div className="px-6 py-4 border-b border-gray-200 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              Registro de Pacientes
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {pacientes.length} {pacientes.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
            </p>
          </div>
          
          {/* Filtros rápidos */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtros rápidos:</span>
            <button 
              onClick={() => setFiltroEstado('activos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filtroEstado === 'activos' 
                  ? 'bg-emerald-200 text-emerald-800' 
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              Activos ({pacientes.filter(p => p.estado).length})
            </button>
            <button 
              onClick={() => setFiltroEstado('todos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filtroEstado === 'todos' 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Todos ({pacientes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de tabla */}
      {pacientes.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 text-lg font-medium mb-2">No se encontraron pacientes</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            No hay pacientes que coincidan con los filtros actuales.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">paciente</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Información Personal</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Contacto</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Obra Social</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Estado</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => {
                const edad = calcularEdad(paciente.fecha_nacimiento);
                const obraSocial = obrasSociales.find(os => os.id_os === paciente.obraSocial?.id_os);
                
                return (
                  <tr key={paciente.id_paciente} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  

                    {/* Paciente */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {paciente.nombre_paciente[0]}{paciente.apellido_paciente[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {paciente.apellido_paciente}, {paciente.nombre_paciente}
                          </p>
                          <p className="text-gray-500 text-xs">DNI: {paciente.dni}</p>
                        </div>
                      </div>
                    </td>

                    {/* Información Personal */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{edad} años</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{paciente.genero}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{paciente.telefono_paciente}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate max-w-40">{paciente.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Obra Social */}
                    <td className="py-4 px-6">
                      {obraSocial ? (
                        <div>
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{obraSocial.nombre}</span>
                          </div>
                          <p className="text-xs text-gray-500">N° {paciente.nro_obrasocial}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin obra social</span>
                      )}
                    </td>

                      {/* Estado */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        paciente.estado
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {paciente.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-6">
                     
                         
                        
                        <button
                          onClick={() => onEditar(paciente)}
                          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group"
                          title="Editar paciente"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                        </button>
                        
                        <button
                          onClick={() => onEliminar(paciente.id_paciente)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Eliminar paciente"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                        </button>
                      
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {pacientes.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mostrando {pacientes.length} pacientes</span>
            <div className="flex items-center gap-4">
              <span>Pacientes activos: </span>
              <span className="font-semibold text-emerald-600">
                {pacientes.filter(p => p.estado).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};