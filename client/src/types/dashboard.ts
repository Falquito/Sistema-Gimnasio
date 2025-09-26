// types/dashboard.ts
export type TurnoEstado = 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO';
export type StatusFilter = 'todos' | TurnoEstado;

export interface FilterState {
  searchTerm: string;
  statusFilter: StatusFilter;
}
