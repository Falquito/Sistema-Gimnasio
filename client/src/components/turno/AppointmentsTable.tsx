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
import type { Turno } from '../../types/turnos';
import { getStatusConfig, formatearFecha, formatearHora, getInitials } from '../../utils/dashboard.utils';

interface AppointmentsTableProps {
  turnos: Turno[];
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  onCancelTurno: (id: number) => Promise<void>;
  onEditTurno?: (turno: Turno) => void;
  onViewDetails?: (turno: Turno) => void;
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
  turnos,
  loading,
  searchTerm,
  statusFilter,
  onCancelTurno,
  onEditTurno,
  onViewDetails,
}) => {
  const [selectedTurno, setSelectedTurno] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  if (turnos.length === 0 && !loading) {
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
              {turnos.length} {turnos.length === 1 ? 'sesión encontrada' : 'sesiones encontradas'}
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
            {turnos.map((turno, index) => {
              const statusConfig = getImprovedStatusConfig(turno.estado);
              const StatusIcon = statusConfig.icon;

              const cliente = pickCliente(turno);
              const profesional = pickProfesional(turno);
              const servicio = pickServicio(turno);
              const duracion = servicio.duracionMin ?? calcDuracionMin(turno);

              const isSelected = selectedTurno === turno.idTurno;
              const isHighlighted = isToday(turno.fecha);

              return (
                <React.Fragment key={turno.idTurno}>
                  <tr 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-green-50' : ''
                    } ${
                      isHighlighted ? 'border-l-4 border-l-green-500' : ''
                    }`}
                    onClick={() => setSelectedTurno(isSelected ? null : turno.idTurno)}
                  >
                    {/* Estado */}
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </div>
                      {isHighlighted && (
                        <div className="text-xs text-green-600 font-medium mt-1">¡Hoy!</div>
                      )}
                    </td>

                    {/* Cliente simplificado */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {getInitials(cliente.nombre || 'N', cliente.apellido || 'A')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {(cliente.apellido || cliente.nombre)
                              ? `${cliente.apellido} ${cliente.nombre}`.trim()
                              : '—'}
                          </p>
                          <p className="text-gray-500 text-xs">ID: {cliente.id ?? '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Servicio simplificado */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{servicio.nombre}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-gray-500 text-sm">{duracion} min</span>
                          {servicio.precio > 0 && (
                            <span className="text-green-600 text-sm font-semibold">${servicio.precio}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Profesional simplificado */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 font-medium">
                          {(profesional.apellido || profesional.nombre)
                            ? `${profesional.nombre} ${profesional.apellido}`.trim()
                            : '—'}
                        </p>
                        {profesional.especialidad && (
                          <p className="text-gray-500 text-xs">{profesional.especialidad}</p>
                        )}
                      </div>
                    </td>

                    {/* Horario simplificado */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatearHora(turno.horaInicio)}
                          {turno.horaFin ? ` - ${formatearHora(turno.horaFin)}` : ''}
                        </p>
                        <p className="text-gray-500 text-sm capitalize">
                          {getRelativeDate(turno.fecha)}
                        </p>
                      </div>
                    </td>

                    {/* Duración simplificada */}
                    <td className="py-4 px-6">
                      <span className="text-gray-700 text-sm font-medium">{duracion}m</span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails?.(turno);
                          }}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors group" 
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTurno?.(turno);
                          }}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors group" 
                          title="Editar turno"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        </button>
                        
                        {turno.estado !== 'CANCELADO' && turno.estado !== 'COMPLETADO' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelTurno(turno.idTurno);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Cancelar turno"
                          >
                            <XCircle className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                          </button>
                        )}
                        
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                          <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Fila expandible con detalles simplificados */}
                  {isSelected && (
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Información del cliente */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              Información del Cliente
                            </h4>
                            <div className="space-y-2">
                              {cliente.telefono && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{cliente.telefono}</span>
                                </div>
                              )}
                              {cliente.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{cliente.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Notas */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              Notas y Observaciones
                            </h4>
                            <div className="text-sm text-gray-700">
                              {turno.rutina || 'Sin observaciones adicionales'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Acciones simplificadas */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex gap-3">
                            <button 
                              onClick={() => onViewDetails?.(turno)}
                              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Ver Detalles
                            </button>
                            <button 
                              onClick={() => onEditTurno?.(turno)}
                              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Editar
                            </button>
                            {turno.estado === 'PROGRAMADO' && (
                              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Confirmar
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer simplificado */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Mostrando {turnos.length} sesiones</span>
        </div>
      </div>
    </div>
  );
};