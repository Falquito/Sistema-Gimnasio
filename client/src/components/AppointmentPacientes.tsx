// components/AppointmentsTable.tsx
import React, { useState } from 'react';
import { 
  Filter, 
  Eye, 
  Edit3, 
  XCircle, 
  MoreHorizontal, 
  Target, 
  Search,
  Calendar,
  Clock,
  User,
  Briefcase,
  ChevronDown,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Pause,
  X
} from 'lucide-react';
// import type { Paciente } from '../../types/paciente';
// import { getStatusConfig, formatearFecha, formatearHora, getInitials } from '../../utils/dashboard.utils';
import type { Paciente } from '../types/pacientes';
import { formatearFecha } from '../utils/dashboard.utils';

interface AppointmentsTableProps {
  pacientes?: Paciente[];
  loading?: boolean;
  searchTerm?: string;
  statusFilter?: string;
  onCancelPacientes?: (id: number) => Promise<void>;
  onEditPaciente?: (paciente: Paciente) => void;
  onViewDetails?: (paciente: Paciente) => void;
}

// Configuración de estados mejorada
const getImprovedStatusConfig = (estado: string) => {
  const configs: Record<string, {
    label: string;
    icon: any;
    color: string;
    badgeColor: string;
  }> = {
    'PROGRAMADO': {
      label: 'Programado',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    'CONFIRMADO': {
      label: 'Confirmado',
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-700 border-green-200',
      badgeColor: 'bg-green-100 text-green-800'
    },
    'EN_PROGRESO': {
      label: 'En progreso',
      icon: Clock,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    'COMPLETADO': {
      label: 'Completado',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    'CANCELADO': {
      label: 'Cancelado',
      icon: X,
      color: 'bg-red-50 text-red-700 border-red-200',
      badgeColor: 'bg-red-100 text-red-800'
    },
    'NO_ASISTIO': {
      label: 'No asistió',
      icon: AlertCircle,
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      badgeColor: 'bg-gray-100 text-gray-800'
    },
    'PAUSADO': {
      label: 'Pausado',
      icon: Pause,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    }
  };
  return configs[estado] || configs['PROGRAMADO'];
};

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  pacientes,
  loading,
  searchTerm,
  statusFilter,
  onCancelPacientes,
  onEditPaciente,
  onViewDetails,
}) => {
  const [selectedTurno, setSelectedTurno] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  if (pacientes.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sesiones de Entrenamiento</h2>
              <p className="text-gray-600 text-sm mt-1">0 sesiones encontradas</p>
            </div>
          </div>
        </div>
        <div className="text-center py-16">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 text-lg font-medium mb-2">No se encontraron sesiones</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm || statusFilter !== 'todos'
              ? 'Ajusta los filtros de búsqueda para ver más resultados'
              : 'No hay turnos registrados aún. Crea tu primera sesión para comenzar.'}
          </p>
        </div>
      </div>
    );
  }


const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const isOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  toMin(aStart) < toMin(bEnd) && toMin(aEnd) > toMin(bStart);

  const pickCliente = (t: any) => {
    const c = t?.idCliente ?? t?.idPaciente ?? t?.cliente;
    if (!c) return { id: '—', nombre: '', apellido: '', email: '', telefono: '' };

    const id = c.id_cliente ?? c.id_paciente ?? c.id ?? '—';
    const nombre = c.nombre_cliente ?? c.nombre_paciente ?? c.nombre ?? '';
    const apellido = c.apellido_cliente ?? c.apellido_paciente ?? c.apellido ?? '';
    const email = c.email ?? c.correo ?? '';
    const telefono = c.telefono ?? c.celular ?? '';

    return { id, nombre, apellido, email, telefono };
  };

  const pickProfesional = (t: any) => {
    const p = t?.idProfesional ?? t?.profesional;
    if (!p) return { nombre: '', apellido: '', especialidad: '' };

    const nombre = p.nombreProfesional ?? p.nombre ?? '';
    const apellido = p.apellidoProfesional ?? p.apellido ?? '';
    const especialidad = p.especialidad ?? p.tipo ?? '';
    return { nombre, apellido, especialidad };
  };

  const pickServicio = (t: any) => {
    const s = t?.idServicio ?? t?.servicio;
    const nombre = s?.nombre ?? '—';
    const duracionMin = s?.duracionMin;
    const precio = s?.precio ?? 0;
    return { nombre, duracionMin, precio };
  };

  const calcDuracionMin = (t: any) => {
    const [h1, m1] = String(t?.horaInicio ?? '').split(':').map(Number);
    const [h2, m2] = String(t?.horaFin ?? '').split(':').map(Number);
    if ([h1, m1, h2, m2].every(Number.isFinite)) {
      return h2 * 60 + m2 - (h1 * 60 + m1);
    }
    return 60;
  };

  const isToday = (fecha: string) => {
    const today = new Date();
    const turnoDate = new Date(fecha);
    return today.toDateString() === turnoDate.toDateString();
  };

  const isTomorrow = (fecha: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const turnoDate = new Date(fecha);
    return tomorrow.toDateString() === turnoDate.toDateString();
  };

  const getRelativeDate = (fecha: string) => {
    if (isToday(fecha)) return 'Hoy';
    if (isTomorrow(fecha)) return 'Mañana';
    return formatearFecha(fecha);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header simplificado */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Sesiones de Entrenamiento
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {pacientes.length} {pacientes.length === 1 ? 'sesión encontrada' : 'sesiones encontradas'}
            </p>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Filtros avanzados">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>



      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Estado</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Cliente</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Servicio</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Profesional</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Horario</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Duración</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pacientes.map((paciente, index) => {
            //   const statusConfig = getImprovedStatusConfig(paciente.);
            //   const StatusIcon = statusConfig.icon;

              const cliente = pickCliente(paciente);
              const profesional = pickProfesional(paciente);
              const servicio = pickServicio(paciente);
              const duracion = servicio.duracionMin ?? calcDuracionMin(paciente);

              const isSelected = selectedTurno === paciente.id_paciente;
              const isHighlighted = isToday(paciente.fecha_nacimiento!);

              return (
                <React.Fragment key={paciente.id_paciente}>
                  <tr 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-green-50' : ''
                    } ${
                      isHighlighted ? 'border-l-4 border-l-green-500' : ''
}`}
                    onClick={() => setSelectedTurno(isSelected ? null : paciente.id_paciente)}
                  >

                   
                    {/* Acciones */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails?.(paciente);
                          }}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors group" 
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPaciente?.(paciente);
                          }}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors group" 
                          title="Editar turno"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        </button>
                        
                        {/* {paciente.estado !== 'CANCELADO' && paciente.estado !== 'COMPLETADO' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelPacientes(paciente.id_paciente);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Cancelar turno"
                          >
                            <XCircle className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                          </button>
                        )} */}
                        
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                          <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Fila expandible con detalles simplificados */}
                  
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer simplificado */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Mostrando {pacientes.length} sesiones</span>
        </div>
      </div>
    </div>
  );
};