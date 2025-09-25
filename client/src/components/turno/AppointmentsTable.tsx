// components/AppointmentsTable.tsx
import React from 'react';
import { Filter, Eye, Edit3, XCircle, MoreHorizontal, Target } from 'lucide-react';
import type { Turno } from '../../types/turnos';
import { getStatusConfig, formatearFecha, formatearHora, getInitials } from '../../utils/dashboard.utils';

interface AppointmentsTableProps {
  turnos: Turno[];
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  onCancelTurno: (id: number) => Promise<void>;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  turnos,
  loading,
  searchTerm,
  statusFilter,
  onCancelTurno,
}) => {
  if (turnos.length === 0 && !loading) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Sesiones de Entrenamiento</h2>
              <p className="text-gray-400 text-sm mt-1">0 sesiones encontradas</p>
            </div>
          </div>
        </div>
        <div className="text-center py-16">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No se encontraron sesiones</p>
          <p className="text-gray-500 text-sm">
            {searchTerm || statusFilter !== 'todos'
              ? 'Ajusta los filtros de búsqueda para ver más resultados'
              : 'No hay turnos registrados aún'}
          </p>
        </div>
      </div>
    );
  }

  // === Helpers según tu API ===
  const getClienteNombre = (t: any) => {
    const c = t?.idCliente;
    if (!c) return '—';
    return `${c.apellido_cliente ?? ''} ${c.nombre_cliente ?? ''}`.trim() || '—';
  };
  const getClienteId = (t: any) => t?.idCliente?.id_cliente ?? '—';
  const getProfesionalNombre = (t: any) => {
    const p = t?.idProfesional;
    if (!p) return '—';
    return `${p.nombreProfesional ?? ''} ${p.apellidoProfesional ?? ''}`.trim() || '—';
  };
  const getServicioNombre = (t: any) => t?.idServicio?.nombre ?? '—';
  const getDuracionMin = (t: any) => {
    const [h1, m1] = String(t?.horaInicio ?? '').split(':').map(Number);
    const [h2, m2] = String(t?.horaFin ?? '').split(':').map(Number);
    if ([h1, m1, h2, m2].every(Number.isFinite)) return h2 * 60 + m2 - (h1 * 60 + m1);
    return 60;
  };
  const getClienteInitials = (t: any) => {
    const c = t?.idCliente;
    return getInitials(c?.nombre_cliente ?? 'N', c?.apellido_cliente ?? 'A');
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Sesiones de Entrenamiento</h2>
            <p className="text-gray-400 text-sm mt-1">{turnos.length} sesiones encontradas</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/30">
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Estado</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Cliente</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Servicio</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Profesional</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Horario</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Duración</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((turno) => {
              const statusConfig = getStatusConfig(turno.estado);
              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={turno.idTurno}
                  className="border-t border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  {/* Estado */}
                  <td className="py-4 px-6">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getClienteInitials(turno)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{getClienteNombre(turno)}</p>
                        <p className="text-gray-400 text-xs">ID: {getClienteId(turno)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Servicio */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-white">{getServicioNombre(turno)}</p>
                      <p className="text-gray-400 text-sm">{getDuracionMin(turno)} min</p>
                    </div>
                  </td>

                  {/* Profesional */}
                  <td className="py-4 px-6">
                    <p className="text-gray-300">{getProfesionalNombre(turno)}</p>
                  </td>

                  {/* Horario */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white">
                        {formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}
                      </p>
                      <p className="text-gray-400 text-sm capitalize">{formatearFecha(turno.fecha)}</p>
                    </div>
                  </td>

                  {/* Duración */}
                  <td className="py-4 px-6">
                    <p className="text-gray-300 text-sm">{getDuracionMin(turno)} minutos</p>
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Ver detalles">
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Editar turno">
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      {turno.estado !== 'CANCELADO' && (
                        <button
                          onClick={() => onCancelTurno(turno.idTurno)}
                          className="p-2 hover:bg-red-700/50 rounded-lg transition-colors"
                          title="Cancelar turno"
                        >
                          <XCircle className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
