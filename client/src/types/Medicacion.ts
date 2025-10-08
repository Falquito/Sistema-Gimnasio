// types/Medicacion.ts
export interface Medicacion {
  idMedicacion: number;          // ID único
  farmaco: string;               // Nombre del medicamento
  dosis: string;                 // Dosis indicada
  frecuencia: string;            // Frecuencia de administración
  indicacion: string;            // Motivo o diagnóstico asociado
  fechaInicio: string;           // Fecha de inicio (YYYY-MM-DD)
  fechaFin?: string | null;      // Fecha de fin (opcional)
  estado: "ACTIVO" | "SUSPENDIDO" | "COMPLETADO"; // Enum exacto del backend
  creadoEn?: string;             // Fecha de creación (opcional)
}
