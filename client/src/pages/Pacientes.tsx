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

// Tipos
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
  id_obraSocial: number;
  nro_obraSocial: number;
}

export interface ObraSocial {
  id_os: number;
  nombre: string;
}

const PacientesPage = () => {
  // Estados
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [pacientes, setPacientes] = useState<PacienteListItem[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [filtroGenero, setFiltroGenero] = useState<'todos' | 'Femenino' | 'Masculino' | 'Otro'>('todos');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carga inicial
  const getObrasSociales = async () => {
    const obrasSocialesLista = await listarObrasSociales();
    setObrasSociales(obrasSocialesLista);
  };

  const getPacientes = async () => {
    const pacientesLista = await listarPacientes();
    setPacientes(pacientesLista);
    setLoading(false);
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
  const generoAPIaLabel = (g: string | undefined) => {
    if (!g) return 'Otro';
    const v = g.toUpperCase();
    if (v === 'F') return 'Femenino';
    if (v === 'M') return 'Masculino';
    return 'Otro';
  };

  // Filtrado de pacientes
  const pacientesFiltrados = useMemo(() => {
    let filtrados = pacientes;

    if (terminoBusqueda) {
      const q = terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.nombre_paciente.toLowerCase().includes(q) ||
          p.apellido_paciente.toLowerCase().includes(q) ||
          p.dni.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q)
      );
    }

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter((p) => (filtroEstado === 'activos' ? p.estado : !p.estado));
    }

    if (filtroGenero !== 'todos') {
      filtrados = filtrados.filter((p) => generoAPIaLabel(p.genero) === filtroGenero);
    }

    return filtrados;
  }, [pacientes, terminoBusqueda, filtroEstado, filtroGenero]);

  // Stats
  const stats = useMemo(
    () => ({
      totalPacientes: pacientes.length,
      pacientesActivos: pacientes.filter((p) => p.estado).length,
      pacientesConObraSocial: pacientes.filter((p) => p.obraSocial).length,
    }),
    [pacientes]
  );

  // Handlers
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

    // --- Normalizaciones seguras ---
    // genero: UI usa etiquetas, back espera 1 letra
    const mapGenero = (g: string) => {
      const v = (g || '').toLowerCase();
      if (v.startsWith('f')) return 'F';
      if (v.startsWith('m')) return 'M';
      return 'O'; // si tu back acepta 'O'
    };

    const genero = mapGenero(paciente.genero);

    // dni: recortar a 9 por si acaso
    const dni = String(paciente.dni || '').slice(0, 9);

    // obra social: number | null
    const idObra =
      paciente.id_obraSocial === '' || paciente.id_obraSocial === null || paciente.id_obraSocial === undefined
        ? null
        : Number(paciente.id_obraSocial);

    const nroObra =
      paciente.nro_obraSocial === '' || paciente.nro_obraSocial === null || paciente.nro_obraSocial === undefined
        ? null
        : Number(paciente.nro_obraSocial);

    try {
      if (isEditing) {
        await apiFetch(`/pacientes/${paciente.id_paciente}`, {
          method: 'PATCH',
          body: JSON.stringify({
            nombre: paciente.nombre_paciente,
            apellido: paciente.apellido_paciente,
            telefono: paciente.telefono_paciente,
            genero, // 'M' | 'F' | 'O'
            dni, // <= 9
            observaciones: paciente.observaciones,
            nro_obraSocial: nroObra, // number | null
            id_obraSocial: idObra, // number | null
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
            genero, // 'M' | 'F' | 'O'
            dni, // <= 9
            observaciones: paciente.observaciones,
            fecha_nacimiento: paciente.fecha_nacimiento,
            nro_obraSocial: nroObra, // number | null
            id_obraSocial: idObra, // nombre correcto
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
        getPacientes();
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
    <div className="min-h-screen ">
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
          onTerminoBusquedaChange={setTerminoBusqueda}
          onFiltroEstadoChange={setFiltroEstado}
          onFiltroGeneroChange={setFiltroGenero}
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

// (Opcional) Podés eliminar el ModalFormulario viejo si ya usás SimplePatientModal.

export default PacientesPage;
