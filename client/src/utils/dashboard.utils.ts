// utils/dashboard.utils.ts
import { CheckCircle, Clock, UserCheck, UserX } from 'lucide-react';
import type { Turno } from '../types/turnos';
import type { StatusConfig, DashboardStats } from '../types/dashboard';

export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatearHora = (hora: string): string => {
  return hora; // Ya viene en formato HH:mm
};

export const getStatusConfig = (status: Turno['estado']): StatusConfig => {
  const configs: Record<Turno['estado'], StatusConfig> = {
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

export const calcularEstadisticas = (turnos: Turno[]): DashboardStats => {
  const hoy = new Date().toISOString().split('T')[0];
  const esHoy = (fecha: string) => fecha === hoy;
  
  const total = turnos.length;
  const pendientes = turnos.filter(t => t.estado === 'PENDIENTE').length;
  const completados = turnos.filter(t => t.estado === 'COMPLETADO').length;
  const cancelados = turnos.filter(t => t.estado === 'CANCELADO').length;
  const hoyTurnos = turnos.filter(t => esHoy(t.fecha)).length;

  return { total, pendientes, completados, cancelados, hoyTurnos };
};

export const getInitials = (nombre: string, apellido: string): string => {
  const n = nombre || 'N';
  const a = apellido || 'A';
  return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
};

export const filterTurnos = (
  turnos: Turno[], 
  searchTerm: string, 
  statusFilter: string
): Turno[] => {
  return turnos.filter(turno => {
    const nombreCompleto = `${turno.idProfesional?.nombre || ''} ${turno.idProfesional?.apellido || ''}`.toLowerCase();
    const servicioNombre = turno.idServicio?.nombre?.toLowerCase() || '';
    
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
                         servicioNombre.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || turno.estado.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
};