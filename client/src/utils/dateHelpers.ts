// utils/dateHelpers.ts - Utilidades para fechas
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatearHora = (hora: string): string => {
  const [hh, mm] = hora.split(':');
  const date = new Date();
  date.setHours(parseInt(hh), parseInt(mm));
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const fechaToISO = (fecha: string, hora: string): string => {
  return `${fecha}T${hora}:00.000Z`;
};

export const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const addDays = (fecha: string, days: number): string => {
  const date = new Date(fecha);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};