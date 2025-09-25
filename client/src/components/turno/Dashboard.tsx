// Dashboard.tsx - Componente Principal
import React, { useState } from 'react';
import { useTurnos } from '../../hooks/useTurnos';
import { turnosApi } from '../../services/turnos.services';
import type { FilterState } from '../../types/dashboard';
import type { NewSessionFormData } from './NewSessionModal';
import { calcularEstadisticas, filterTurnos } from '../../utils/dashboard.utils';

// Componentes
import { DashboardHeader } from './DashboardHeader';
import { DailySummary } from './DailySummary';
import { SearchFilters } from './SearchFilters';
import { AppointmentsTable } from './AppointmentsTable';
import { NewSessionModal } from './NewSessionModal';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

/* ====================== Helpers & constantes ====================== */
// TODO: Reemplazar por el ID real del usuario logueado (desde tu sesión/JWT/endpoint /me)
const RECEPCIONISTA_ID = 1;

/** Construye ISO con offset -03:00 (AR) para que el backend lo pueda partir en fecha/hora. */
function toISOWithTZ(dateISO: string, hhmm: string) {
  return `${dateISO}T${hhmm}:00-03:00`;
}
/* ================================================================= */

const Dashboard: React.FC = () => {
  // Estados locales
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'todos'
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);

  // Custom hooks
  const { turnos, loading, error, refetch } = useTurnos(undefined, filters.statusFilter);

  // Datos calculados
  const stats = calcularEstadisticas(turnos);
  const filteredTurnos = filterTurnos(turnos, filters.searchTerm, filters.statusFilter);

  // Handlers
  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleStatusChange = (statusFilter: string) => {
    setFilters(prev => ({ ...prev, statusFilter }));
  };

  const handleRefresh = () => {
    setActionError(null);
    refetch();
  };

  const handleCompleteTurno = async (id: number): Promise<void> => {
  try {
    console.log(`Completando turno ID: ${id}`);
    
    // Confirmación con mensaje específico
    const confirmed = confirm(
      '¿Marcar esta sesión como completada?\n\n' +
      'Esta acción confirmará que la sesión de entrenamiento fue realizada exitosamente.'
    );
    
    if (!confirmed) return;
    
    await turnosApi.completarTurno(id);
    
    console.log('Turno completado exitosamente');
    
    // Mostrar mensaje de éxito
    alert('¡Sesión marcada como completada!');
    
    // Recargar los turnos para mostrar el cambio de estado
    refetch();
    
    // Limpiar cualquier error anterior
    setActionError(null);
    
  } catch (error) {
    console.error('Error al completar turno:', error);
    
    const message = error instanceof Error ? error.message : 'Error desconocido al completar turno';
    setActionError(message);
    
    // También mostrar alert para feedback inmediato
    alert(`Error al completar: ${message}`);
  }
};

  const handleCancelTurno = async (id: number): Promise<void> => {
    if (!confirm('¿Estás seguro de que quieres cancelar este turno?')) return;

    try {
      await turnosApi.cancelarTurno(id, { motivo: 'Cancelado desde dashboard' });
      refetch();
      setActionError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cancelar turno';
      setActionError(message);
    }
  };

  /** Crea la sesión (turno) en el backend al confirmar el modal */
  const handleCreateSession = async (data: NewSessionFormData) => {
    try {
      console.log('Datos recibidos del modal:', data);
      
      // Validaciones
      if (!data.clienteId || !data.profesionalId || !data.fecha || !data.horaInicio) {
        throw new Error('Faltan datos obligatorios');
      }

      // Convertir fecha y hora a ISO
      const fechaLocal = new Date(`${data.fecha}T${data.horaInicio}:00`);
      const fechaUTC = fechaLocal.toISOString();

      const turnoRequest = {
        pacienteId: data.clienteId,
        profesionalId: data.profesionalId,
        recepcionistaId: RECEPCIONISTA_ID,
        inicio: fechaUTC,
        observacion: data.rutina || undefined
      };

      console.log('Enviando al backend:', turnoRequest);

      const turnoCreado = await turnosApi.crearTurno(turnoRequest);
      
      console.log('Turno creado:', turnoCreado);
      alert('¡Sesión programada exitosamente!');
      
      // Recargar los turnos para mostrar el nuevo
      refetch();
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error; // Re-lanzar para que el modal no se cierre
    }
  };

  const handleDismissError = () => {
    setActionError(null);
  };

  // Renderizado condicional para loading
  if (loading && turnos.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header con el modal integrado */}
      <div className="border-b border-gray-800/50 backdrop-blur-sm bg-black/90">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                {/* Zap icon */}
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SharkFit
                </h1>
                <p className="text-gray-400 text-sm">Panel de gestión de entrenamientos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm disabled:opacity-50"
              >
                {/* RefreshCw icon */}
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
              
              <NewSessionModal onSubmit={handleCreateSession} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Error general de la API */}
        {error && (
          <ErrorAlert message={error} />
        )}

        {/* Error de acciones */}
        {actionError && (
          <ErrorAlert message={actionError} onDismiss={handleDismissError} />
        )}

        {/* Filtros de búsqueda */}
        <SearchFilters 
          filters={filters}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />

        {/* Tabla de turnos */}
        <AppointmentsTable 
          turnos={filteredTurnos}
          loading={loading}
          searchTerm={filters.searchTerm}
          statusFilter={filters.statusFilter}
          onCancelTurno={handleCancelTurno}
          onCompleteTurno={handleCompleteTurno} 
        />
      </div>
    </div>
  );
};

export default Dashboard;