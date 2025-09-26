// utils/dashboard.utils.ts
import { CheckCircle, Clock, UserCheck, UserX } from 'lucide-react';
import type { Turno } from '../types/turnos';
import type { StatusFilter } from '../types/dashboard';

/* ===================== Tipos locales ===================== */
export interface DashboardStats {
  total: number;
  pendientes: number;
  completados: number;
  cancelados: number;
  hoyTurnos: number;
}
/* ========================================================= */

const lower = (v: any) => (v ?? '').toString().toLowerCase();
const upper = (v: any) => (v ?? '').toString().toUpperCase();

/** Traduce el filtro de UI a estados reales del backend */
const estadosPermitidosPorFiltro = (statusFilter: StatusFilter): string[] => {
  const s = upper(statusFilter);
  if (s === 'TODOS') return [];                            // sin filtro
  if (s === 'PROGRAMADO') return ['PENDIENTE', 'CONFIRMADO']; // CLAVE
  if (s === 'COMPLETADO') return ['COMPLETADO'];
  if (s === 'CANCELADO') return ['CANCELADO'];
  return [s];
};

export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatearHora = (hora: string): string => hora;

export const getStatusConfig = (status: any) => {
  const key = upper(status);
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
  } as const;

  return (configs as any)[key] || configs.PENDIENTE;
};

export const calcularEstadisticas = (turnos: Turno[]): DashboardStats => {
  const hoy = new Date().toISOString().split('T')[0];
  const esHoy = (fecha: string) => fecha === hoy;

  const total = turnos.length;
  const pendientes = turnos.filter(t => upper((t as any).estado) === 'PENDIENTE').length;
  const completados = turnos.filter(t => upper((t as any).estado) === 'COMPLETADO').length;
  const cancelados = turnos.filter(t => upper((t as any).estado) === 'CANCELADO').length;
  const hoyTurnos = turnos.filter(t => esHoy((t as any).fecha)).length;

  return { total, pendientes, completados, cancelados, hoyTurnos };
};

export const getInitials = (nombre: string, apellido: string): string => {
  const n = nombre || 'N';
  const a = apellido || 'A';
  return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
};

/**
 * Filtro principal (por texto + estado)
 * - Busca por nombre, apellido, DNI, email del paciente
 * - También por profesional y servicio
 * - Mapea "PROGRAMADO" a ['PENDIENTE','CONFIRMADO']
 */
export const filterTurnos = (
  turnos: Turno[],
  searchTerm: string,
  statusFilter: StatusFilter
): Turno[] => {
  const needle = lower(searchTerm);
  const permitidos = estadosPermitidosPorFiltro(statusFilter);

  return (turnos ?? []).filter((t: any) => {
    // ---- match estado ----
    const estado = upper(t.estado || t.status || t.estadoTurno);
    const matchEstado = permitidos.length === 0 || permitidos.includes(estado);
    if (!matchEstado) return false;

    // ---- match texto ----
    if (!needle) return true;

    const paciente = t.paciente || t.idPaciente || {};
    const profesional = t.profesional || t.idProfesional || {};
    const servicio = t.servicio || t.idServicio || {};

    const campos = [
      paciente.nombre,
      paciente.apellido,
      paciente.nombre_paciente,
      paciente.apellido_paciente,
      paciente.dni,
      paciente.documento,
      paciente.email,
      profesional.nombre,
      profesional.apellido,
      servicio.nombre,
    ];

    return campos.some((c) => lower(c).includes(needle));
  });
};
