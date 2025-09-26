import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
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

// Tipos basados en tu API
interface Turno {
  idTurno: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  rutina: string | null;
  observacion: string | null;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
  fechaAlta: string | null;
  fechaUltUpd: string | null;
  idProfesional: {
    idProfesionales: number;
    nombreProfesional: string;
    apellidoProfesional: string;
    email: string | null;
    telefono: string | null;
    dni: string | null;
    genero: string | null;
    fechaAlta: string | null;
    fechaUltUpd: string | null;
  };
  idServicio: {
    idServicio: number;
    nombre: string;
  };
}

// Interfaces locales para UI
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

// ---------- NUEVO: tipos y opciones del selector de estados ----------
type EstadoTurno = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
type StatusFilter = 'todos' | EstadoTurno;

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos',       label: 'Todos los estados' },
  { value: 'CONFIRMADO',  label: 'Confirmados' },
  { value: 'PENDIENTE',   label: 'Pendientes' },
  { value: 'COMPLETADO',  label: 'Completados' },
  { value: 'CANCELADO',   label: 'Cancelados' },
];

// API Service integrado
class TurnosApiService {
  private baseUrl = 'http://localhost:3000/turnos';

  async listarTurnos(clienteId?: number, estado?: string): Promise<Turno[]> {
    const params = new URLSearchParams();
    if (clienteId) params.append('clienteId', clienteId.toString());
    if (estado && estado !== 'todos') params.append('estado', estado.toUpperCase());

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error al listar turnos:', error);
      throw error;
    }
  }

  async cancelarTurno(id: number, motivo?: string): Promise<Turno | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/cancelar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      return null;
    }
  }
}

const turnosApi = new TurnosApiService();

// Utilidades
const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatearHora = (hora: string): string => {
  return hora; // Ya viene en formato HH:mm
};

const GymAppointmentsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // ---------- NUEVO: tipado del filtro ----------
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewSessionModal, setShowNewSessionModal] = useState<boolean>(false);

  // Cargar turnos desde la API
  const fetchTurnos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await turnosApi.listarTurnos(undefined, statusFilter);
      setTurnos(data);
    } catch (err) {
      setError('Error al cargar los turnos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [statusFilter]);

  // Calcular estadísticas desde los datos reales
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

  const stats = calcularEstadisticas(turnos);

  // ---------- NUEVO: contadores para mostrar en el <select> ----------
  const countsByStatus: Record<EstadoTurno, number> = turnos.reduce<Record<EstadoTurno, number>>(
    (acc, t) => {
      acc[t.estado] = (acc[t.estado] ?? 0) + 1;
      return acc;
    },
    { PENDIENTE: 0, CONFIRMADO: 0, CANCELADO: 0, COMPLETADO: 0 }
  );
  const totalCount = turnos.length;

  const getStatusConfig = (status: EstadoTurno): StatusConfig => {
    const configs: Record<EstadoTurno, StatusConfig> = {
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
    return configs[status];
  };

  const filteredSessions: Turno[] = turnos.filter(turno => {
    const nombreCompleto = `${turno.idProfesional?.nombreProfesional || ''} ${turno.idProfesional?.apellidoProfesional || ''}`.toLowerCase();
    const servicioNombre = turno.idServicio?.nombre?.toLowerCase() || '';
    
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
                          servicioNombre.includes(searchTerm.toLowerCase());

    // ---------- NUEVO: comparación directa (sin toLowerCase) ----------
    const matchesStatus =
      statusFilter === 'todos' || turno.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelarTurno = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      const result = await turnosApi.cancelarTurno(id, 'Cancelado desde dashboard');
      if (result) {
        fetchTurnos(); // Recargar datos
      }
    }
  };

  const getInitials = (nombre: string, apellido: string): string => {
    const n = nombre || 'N';
    const a = apellido || 'A';
    return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 backdrop-blur-sm bg-black/90">
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
                onClick={fetchTurnos}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <button 
                onClick={() => setShowNewSessionModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/25"
              >
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

        {/* Resumen del día actual */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Resumen del Día</h2>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{stats.hoyTurnos}</p>
              <p className="text-gray-400 text-sm">turnos programados</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{stats.completados}</p>
              <p className="text-green-300 text-xs">Completados</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{stats.pendientes}</p>
              <p className="text-yellow-300 text-xs">Pendientes</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{stats.cancelados}</p>
              <p className="text-red-300 text-xs">Cancelados</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{stats.total}</p>
              <p className="text-blue-300 text-xs">Total</p>
            </div>
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
              {/* ---------- NUEVO: select con opciones correctas + contadores ---------- */}
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-green-500/50 backdrop-blur-sm"
              >
                {STATUS_OPTIONS.map(opt => {
                  const count = opt.value === 'todos' ? totalCount : countsByStatus[opt.value] ?? 0;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({count})
                    </option>
                  );
                })}
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
                {filteredSessions.map((turno) => {
                  const statusConfig = getStatusConfig(turno.estado as EstadoTurno);
                  const StatusIcon = statusConfig.icon;
                  
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
                            {getInitials(turno.idProfesional?.nombreProfesional || 'N', turno.idProfesional?.apellidoProfesional || 'A')}
                          </div>
                          <div>
                            <p className="font-semibold text-white">Cliente #{turno.idTurno}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{turno.idServicio?.nombre || 'Servicio no disponible'}</p>
                          <p className="text-gray-400 text-sm">60 min</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-300">{turno.idProfesional?.nombreProfesional || 'N/A'} {turno.idProfesional?.apellidoProfesional || ''}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-white">{formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}</p>
                          <p className="text-gray-400 text-sm capitalize">{formatearFecha(turno.fecha)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-300 text-sm">60 minutos</p>
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

      {/* Modal Nueva Sesión */}
      {showNewSessionModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewSessionModal(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-pulse"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideInFromBottom 0.3s ease-out'
            }}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                  <Plus className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Nueva Sesión de Entrenamiento</h2>
                  <p className="text-gray-400 text-sm">Programa una nueva cita</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewSessionModal(false)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400"
                  />
                </div>

                {/* Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Servicio</label>
                  <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white">
                    <option value="">Seleccionar servicio</option>
                    <option value="entrenamiento-personal">Entrenamiento Personal</option>
                    <option value="clase-grupal">Clase Grupal</option>
                    <option value="consulta-nutricional">Consulta Nutricional</option>
                  </select>
                </div>

                {/* Profesional */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profesional</label>
                  <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white">
                    <option value="">Seleccionar profesional</option>
                    <option value="1">Carlos Rodríguez</option>
                    <option value="2">María González</option>
                    <option value="3">Juan Pérez</option>
                  </select>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white"
                  />
                </div>

                {/* Hora Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hora de Inicio</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white"
                  />
                </div>

                {/* Hora Fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hora de Fin</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white"
                  />
                </div>
              </div>

              {/* Rutina/Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rutina/Observaciones</label>
                <textarea
                  rows={4}
                  placeholder="Detalles de la rutina o notas adicionales..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-800/30">
              <button 
                onClick={() => setShowNewSessionModal(false)}
                className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-500/25">
                Programar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GymAppointmentsDashboard;
