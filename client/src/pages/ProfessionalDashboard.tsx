// pages/ProfessionalDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle, AlertCircle,Calendar as CalendarIcon } from 'lucide-react';
import ProfessionalCalendarView from '../components/calendar/ProfessionalCalendarView';
import { turnosApi, type ProfessionalStats } from '../services/turnos.services';
import type { Turno } from '../types/turnos';

interface ProfessionalDashboardProps {
  professionalId: number; // ID del profesional logueado
  professionalName: string;
}

export default function ProfessionalDashboard({ 
  professionalId, 
  professionalName 
}: ProfessionalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');
  const [stats, setStats] = useState<ProfessionalStats>({
    turnosHoy: 0,
    turnosSemana: 0,
    turnosMes: 0,
    pacientesUnicos: 0,
    turnosCompletados: 0,
    turnosCancelados: 0,
    turnosPendientes: 0,
    proximosTurnos: []
  });
  const [loading, setLoading] = useState(false);

  // Cargar estadísticas usando el nuevo método
  const loadStats = async () => {
    setLoading(true);
    try {
      console.log('Loading stats for professional:', professionalId);
      
      // Usar el nuevo método que maneja todo automáticamente
      const professionalStats = await turnosApi.getProfessionalStats(professionalId);
      
      console.log('Stats loaded:', professionalStats);
      setStats(professionalStats);
      
    } catch (error) {
      console.error('Error loading stats:', error);
      // En caso de error, mantener estadísticas vacías
      setStats({
        turnosHoy: 0,
        turnosSemana: 0,
        turnosMes: 0,
        pacientesUnicos: 0,
        turnosCompletados: 0,
        turnosCancelados: 0,
        turnosPendientes: 0,
        proximosTurnos: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas cuando cambie el profesional
  useEffect(() => {
    if (professionalId) {
      loadStats();
    }
  }, [professionalId]);

  // Funciones de formato
  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:mm
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (fecha: string, hora: string) => {
    const date = new Date(fecha);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (fecha === today.toISOString().split('T')[0]) {
      return `Hoy - ${formatTime(hora)}`;
    } else if (fecha === tomorrow.toISOString().split('T')[0]) {
      return `Mañana - ${formatTime(hora)}`;
    } else {
      return `${formatDate(fecha)} - ${formatTime(hora)}`;
    }
  };

  const getStatusColor = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'confirmado':
      case 'pendiente': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      case 'completado': return 'bg-gray-500';
      case 'reprogramado': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'Pendiente';
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'completado': return 'Completado';
      case 'reprogramado': return 'Reprogramado';
      default: return estado;
    }
  };

  return (
<div className="">
  <div className="bg-white border-b border-gray-100 rounded-3xl shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        {/* Lado izquierdo: título + icono (estilo del 2°) */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md">
            <CalendarIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Turnos</h1>
            <p className="text-gray-600 text-sm">Vista de tus citas programadas</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calendar'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Calendario
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Estadísticas
          </button>
        </div>
      </div>
    </div>
  </div>



      {/* Contenido según tab activo */}
      {activeTab === 'calendar' ? (
        <ProfessionalCalendarView professionalId={professionalId} />
      ) : (
        <div className="p-6">
          {/* Loading state */}
          {loading && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
                <span className="text-gray-600">Cargando estadísticas...</span>
              </div>
            </div>
          )}

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turnos Hoy</p>
                  <p className="text-2xl font-bold text-black">{stats.turnosHoy}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-black">{stats.turnosSemana}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes Únicos</p>
                  <p className="text-2xl font-bold text-black">{stats.pacientesUnicos}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold text-black">{stats.turnosMes}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximos turnos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">Próximos Turnos</h3>
                <button
                  onClick={loadStats}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
              <div className="space-y-3">
                {stats.proximosTurnos.length > 0 ? (
                  stats.proximosTurnos.map((turno) => (
                    <div key={turno.idTurno} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">
                            {turno.idCliente?.nombre} {turno.idCliente?.apellido}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDateTime(turno.fecha, turno.horaInicio)}
                          </div>
                        </div>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(turno.estado)}`}
                      >
                        {getStatusText(turno.estado)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay turnos próximos</p>
                    <p className="text-sm text-gray-400">Los próximos turnos aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estado de turnos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-black mb-4">Resumen de Estados</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-black font-medium">Pendientes</span>
                  </div>
                  <span className="font-bold text-green-600 text-lg">{stats.turnosPendientes}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-gray-500" />
                    <span className="text-black font-medium">Completados</span>
                  </div>
                  <span className="font-bold text-gray-600 text-lg">{stats.turnosCompletados}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-black font-medium">Cancelados</span>
                  </div>
                  <span className="font-bold text-red-600 text-lg">{stats.turnosCancelados}</span>
                </div>

                {/* Gráfico simple de progreso */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Efectividad</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.turnosCompletados + stats.turnosPendientes > 0 
                            ? (stats.turnosCompletados / (stats.turnosCompletados + stats.turnosPendientes + stats.turnosCancelados)) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {stats.turnosCompletados + stats.turnosPendientes + stats.turnosCancelados > 0 
                        ? Math.round((stats.turnosCompletados / (stats.turnosCompletados + stats.turnosPendientes + stats.turnosCancelados)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}