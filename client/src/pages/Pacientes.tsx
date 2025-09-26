// PacientesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { listarObrasSociales, listarPacientes, type PacienteListItem } from '../services/pacientes.services';
import { LoadingSpinner2 } from '../components/turno/LoadingSpinner';
import { apiFetch } from '../lib/api';

// Componentes separados
import { PatientsHeader } from '../components/patients/PatientsHeader';
import { PatientsFilters } from '../components/patients/PatientsFilters';
import { PatientsTable } from '../components/patients/PatientsTable';
import { Notification } from '../components/patients/Notification';
import { SimplePatientModal } from '../components/patients/PatientModal';

// Tipos corregidos para mayor consistencia
type FiltroEstado = 'todos' | 'activos' | 'inactivos';
type FiltroGenero = 'todos' | 'Femenino' | 'Masculino' | 'Otro';

interface Paciente {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  dni: string;
  email: string;
  telefono_paciente: string;
  fecha_nacimiento: string;
  genero: string; // en API puede venir M/F/O
  observaciones?: string;
  fecha_alta: string;
  fecha_ult_upd: string;
  estado: boolean;
  id_obraSocial: number | null;
  nro_obraSocial: number | null;
}

export interface ObraSocial {
  id_os: number;
  nombre: string;
}

const PacientesPage = () => {
  // Estados con tipos específicos
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [pacientes, setPacientes] = useState<PacienteListItem[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');
  const [filtroGenero, setFiltroGenero] = useState<FiltroGenero>('todos');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carga inicial
  const getObrasSociales = async () => {
    try {
      const obrasSocialesLista = await listarObrasSociales();
      setObrasSociales(obrasSocialesLista);
    } catch (error) {
      console.error('Error cargando obras sociales:', error);
      mostrarNotificacion('Error al cargar obras sociales', 'error');
    }
  };

  const getPacientes = async () => {
    try {
      const pacientesLista = await listarPacientes();
      setPacientes(pacientesLista);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      mostrarNotificacion('Error al cargar pacientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getObrasSociales();
    getPacientes();
  }, []);

  // Notificaciones
  const mostrarNotificacion = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helpers
  const generoAPIaLabel = (g: string | undefined): FiltroGenero => {
    if (!g) return 'Otro';
    const v = g.toUpperCase();
    if (v === 'F') return 'Femenino';
    if (v === 'M') return 'Masculino';
    return 'Otro';
  };

  // Filtrado de pacientes mejorado
  const pacientesFiltrados = useMemo(() => {
    console.log('Filtros aplicados:', { terminoBusqueda, filtroEstado, filtroGenero });
    
    let filtrados = pacientes;

    // Filtro por término de búsqueda
    if (terminoBusqueda.trim()) {
      const q = terminoBusqueda.toLowerCase().trim();
      filtrados = filtrados.filter(
        (p) =>
          p.nombre_paciente.toLowerCase().includes(q) ||
          p.apellido_paciente.toLowerCase().includes(q) ||
          p.dni.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q)
      );
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter((p) => 
        filtroEstado === 'activos' ? p.estado : !p.estado
      );
    }

    // Filtro por género
    if (filtroGenero !== 'todos') {
      filtrados = filtrados.filter((p) => generoAPIaLabel(p.genero) === filtroGenero);
    }

    console.log('Pacientes filtrados:', filtrados.length, 'de', pacientes.length);
    return filtrados;
  }, [pacientes, terminoBusqueda, filtroEstado, filtroGenero]);

  // Stats corregido
  const stats = useMemo(
    () => ({
      totalPacientes: pacientes.length,
      pacientesActivos: pacientes.filter((p) => p.estado).length,
      pacientesConObraSocial: pacientes.filter((p) => p.id_obraSocial && p.id_obraSocial > 0).length,
    }),
    [pacientes]
  );

  // Handlers de filtros con tipos específicos
  const handleTerminoBusquedaChange = (value: string) => {
    console.log('Término búsqueda changed:', value);
    setTerminoBusqueda(value);
  };

  const handleFiltroEstadoChange = (value: FiltroEstado) => {
    console.log('Filtro estado changed:', value);
    setFiltroEstado(value);
  };

  const handleFiltroGeneroChange = (value: FiltroGenero) => {
    console.log('Filtro género changed:', value);
    setFiltroGenero(value);
  };

  // Handlers del modal
  const handleOpenModalParaCrear = () => {
    setPacienteSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleOpenModalParaEditar = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setPacienteSeleccionado(null);
  };

  const handleGuardarPaciente = async (paciente: any) => {
    const isEditing = !!paciente.id_paciente;

    // Normalizaciones seguras
    const mapGenero = (g: string) => {
      const v = (g || '').toLowerCase();
      if (v.startsWith('f')) return 'F';
      if (v.startsWith('m')) return 'M';
      return 'O';
    };

    const genero = mapGenero(paciente.genero);
    const dni = String(paciente.dni || '').slice(0, 9);

    // Obra social: usar 0 en lugar de null para evitar errores del backend
    const idObra = paciente.id_obraSocial === '' || 
                   paciente.id_obraSocial === null || 
                   paciente.id_obraSocial === undefined
      ? 0
      : Number(paciente.id_obraSocial);

    const nroObra = paciente.nro_obraSocial === '' || 
                    paciente.nro_obraSocial === null || 
                    paciente.nro_obraSocial === undefined
      ? 0
      : Number(paciente.nro_obraSocial);

    try {
      if (isEditing) {
        await apiFetch(`/pacientes/${paciente.id_paciente}`, {
          method: 'PATCH',
          body: JSON.stringify({
            nombre: paciente.nombre_paciente,
            apellido: paciente.apellido_paciente,
            telefono: paciente.telefono_paciente,
            genero,
            dni,
            observaciones: paciente.observaciones,
            nro_obraSocial: nroObra,
            id_obraSocial: idObra,
            email: paciente.email,
          }),
        });
        mostrarNotificacion('Paciente modificado exitosamente');
      } else {
        await apiFetch(`/pacientes/`, {
          method: 'POST',
          body: JSON.stringify({
            nombre: paciente.nombre_paciente,
            apellido: paciente.apellido_paciente,
            telefono: paciente.telefono_paciente,
            genero,
            dni,
            observaciones: paciente.observaciones,
            fecha_nacimiento: paciente.fecha_nacimiento,
            nro_obraSocial: nroObra,
            id_obraSocial: idObra,
            email: paciente.email,
          }),
        });
        mostrarNotificacion('Paciente creado exitosamente');
      }

      await getPacientes();
      handleCerrarModal();
    } catch (error) {
      mostrarNotificacion('Error al guardar paciente', 'error');
      console.error('Error:', error);
    }
  };

  const handleEliminarPaciente = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
      try {
        await apiFetch<Paciente>(`/pacientes/${id}`, {
          method: 'DELETE',
        });
        await getPacientes();
        mostrarNotificacion('Paciente eliminado exitosamente', 'error');
      } catch (error) {
        mostrarNotificacion('Error al eliminar paciente', 'error');
        console.error('Error:', error);
      }
    }
  };

  const handleVerDetalles = (paciente: any) => {
    console.log('Ver detalles de:', paciente);
  };

  if (loading) return <LoadingSpinner2 />;

  return (
    <div className="min-h-screen">
      {/* Notificaciones */}
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <PatientsHeader
        totalPacientes={stats.totalPacientes}
        pacientesActivos={stats.pacientesActivos}
        pacientesConObraSocial={stats.pacientesConObraSocial}
        onNuevoPaciente={handleOpenModalParaCrear}
      />

      {/* Contenido principal */}
      <div className="max-w-12xl mx-auto px-6 py-6 space-y-6">
        {/* Filtros */}
        <PatientsFilters
          terminoBusqueda={terminoBusqueda}
          filtroEstado={filtroEstado}
          filtroGenero={filtroGenero}
          onTerminoBusquedaChange={handleTerminoBusquedaChange}
          onFiltroEstadoChange={handleFiltroEstadoChange}
          onFiltroGeneroChange={handleFiltroGeneroChange}
        />

        {/* Tabla */}
        <PatientsTable
          pacientes={pacientesFiltrados}
          obrasSociales={obrasSociales}
          onEditar={handleOpenModalParaEditar}
          onEliminar={handleEliminarPaciente}
          onVerDetalles={handleVerDetalles}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SimplePatientModal
          paciente={pacienteSeleccionado}
          pacientesExistentes={pacientes as any}
          onGuardar={handleGuardarPaciente}
          onCerrar={handleCerrarModal}
          obrasSociales={obrasSociales}
        />
      )}
    </div>
  );
};

export default PacientesPage;