import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  RotateCcw, 
  Eye,
  Filter,
  Users,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Edit3,
  UserCheck,
  UserX,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Importar desde los archivos que ya creamos
import { turnosApi } from '../../services/turnos.services';
import { useTurnos } from '../../hooks/useTurnos';
import type { Turno } from '../../types/turnos';
import { formatearFecha, formatearHora } from '../../utils/dateHelpers';

// Interfaces locales solo para UI
interface StatData {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  color: string;
  icon: LucideIcon;
}

interface QuickAction {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

interface StatusConfig {
  color: string;
  label: string;
  icon: LucideIcon;
}

const GymAppointmentsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  
  // Usar el hook personalizado que ya creamos
  const { turnos, loading, error, refetch } = useTurnos(undefined, statusFilter);

  // Resto de funciones utilitarias
  const calcularEstadisticas = (turnos: Turno[]) => {
    const hoy = new Date().toISOString().split('T')[0];
    const esHoy = (fecha: string) => fecha === hoy;
    
    const total = turnos.length;
    const pendientes = turnos.filter(t => t.estado === 'PENDIENTE').length;
    const completados = turnos.filter(t => t.estado === 'COMPLETADO').length;
    const cancelados = turnos.filter(t => t.estado === 'CANCELADO').length;
    const hoyTurnos = turnos.filter(t => esHoy(t.fecha)).length;

    return { total, pendientes, completados, cancelados, hoyTurnos };
  };

  const handleCancelarTurno = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      const result = await turnosApi.cancelarTurno(id, { motivo: 'Cancelado desde dashboard' });
      if (result) {
        refetch(); // Recargar datos usando el hook
      }
    }
  };

  const getInitials = (nombre: string, apellido: string): string => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const stats = calcularEstadisticas(turnos);

  const statsData: StatData[] = [
    { 
      title: 'Total Sesiones', 
      value: stats.total.toString(), 
      subtitle: 'Este mes',
      trend: '+23%',
      color: '',
      icon: Activity
    },
    { 
      title: 'Miembros Activos', 
      value: stats.pendientes.toString(), 
      subtitle: 'Entrenamientos programados',
      trend: '+8%',
      color: '',
      icon: Users
    },
    { 
      title: 'Sesiones Hoy', 
      value: stats.hoyTurnos.toString(), 
      subtitle: 'Programadas para hoy',
      trend: `${stats.pendientes} pendientes`,
      color: '',
      icon: Clock
    },
    { 
      title: 'Completadas', 
      value: stats.completados.toString(), 
      subtitle: 'Este mes',
      trend: '+15%',
      color: '',
      icon: CheckCircle
    }
  ];

  const getStatusConfig = (status: Turno['estado']): StatusConfig => {
    const configs = {
      CONFIRMADO: {
        color: 'text-green-400 border-green-500/50 bg-green-500/10',
        label: 'Confirmado',
        icon: CheckCircle
      },
      PENDIENTE: {
        color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
        label: 'Pendiente',
        icon: Clock
      },
      COMPLETADO: {
        color: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
        label: 'Completado',
        icon: UserCheck
      },
      CANCELADO: {
        color: 'text-red-400 border-red-500/50 bg-red-500/10',
        label: 'Cancelado',
        icon: UserX
      }
    };
    return configs[status] || configs.PENDIENTE;
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Nueva Sesión',
      subtitle: 'Agendar entrenamiento',
      icon: Plus,
      color: '',
      iconColor: ''
    },
    {
      title: 'Ver Calendario',
      subtitle: 'Vista semanal/mensual',
      icon: Calendar,
      color: '',
      iconColor: ''
    },
    {
      title: 'Gestionar Clases',
      subtitle: 'Clases grupales',
      icon: Users,
      color: '',
      iconColor: ''
    },
    {
      title: 'Reportes',
      subtitle: 'Estadísticas y análisis',
      icon: TrendingUp,
      color: '',
      iconColor: ''
    }
  ];

  const filteredSessions: Turno[] = turnos.filter(turno => {
    const nombreCompleto = `${turno.idProfesional.nombre} ${turno.idProfesional.apellido}`.toLowerCase();
    const servicioNombre = turno.idServicio.nombre.toLowerCase();
    
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
                         servicioNombre.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || turno.estado.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });



  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-green-400" />
          <span className="text-lg">Cargando turnos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Header mejorado */}
      <div className="border-b border-gray-800/50 backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  FitManager
                </h1>
                <p className="text-gray-400 text-sm">Panel de gestión de entrenamientos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refetch}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/25">
                <Plus className="w-4 h-4" />
                <span>Nueva Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Error handling */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Stats mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="relative p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-gray-900/70 hover:border-gray-700/50 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-800/70 rounded-xl flex items-center justify-center group-hover:bg-gray-700/70 transition-colors">
                        <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-gray-400 text-sm font-medium">{stat.title}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.subtitle}</p>
                      <p className="text-green-400 text-xs font-medium">{stat.trend}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions mejoradas */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-white">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button key={index} className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm transition-all duration-200 text-left hover:scale-[1.02] hover:bg-gray-900/70 hover:border-gray-700/50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-800/70 rounded-xl flex items-center justify-center group-hover:bg-gray-700/70 transition-all duration-200">
                        <IconComponent className="w-6 h-6 text-gray-300 group-hover:text-white transition-all duration-200 group-hover:scale-110" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white mb-1">{action.title}</p>
                      <p className="text-gray-400 text-sm">{action.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search y filtros */}
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por miembro, entrenador o tipo de sesión..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
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

        {/* Tabla de sesiones con datos reales */}
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Sesiones de Entrenamiento</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredSessions.length} sesiones encontradas
                </p>
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
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((turno) => {
                  const statusConfig = getStatusConfig(turno.estado);
                  const StatusIcon = statusConfig.icon;
                  const nombreCompleto = `${turno.idProfesional.nombre} ${turno.idProfesional.apellido}`;
                  
                  return (
                    <tr key={turno.idTurno} className="border-t border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(turno.idProfesional.nombre, turno.idProfesional.apellido)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">Cliente #{turno.idCliente}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{turno.idServicio.nombre}</p>
                          <p className="text-gray-400 text-sm">{turno.idServicio.duracionMin} min</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-300">{nombreCompleto}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-white">{formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}</p>
                          <p className="text-gray-400 text-sm capitalize">{formatearFecha(turno.fecha)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-300 text-sm">{turno.idServicio.duracionMin} minutos</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                            title="Editar turno"
                          >
                            <Edit3 className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          {turno.estado !== 'CANCELADO' && (
                            <button 
                              onClick={() => handleCancelarTurno(turno.idTurno)}
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
          
          {filteredSessions.length === 0 && !loading && (
            <div className="text-center py-16">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No se encontraron sesiones</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Ajusta los filtros de búsqueda para ver más resultados'
                  : 'No hay turnos registrados aún'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymAppointmentsDashboard; 