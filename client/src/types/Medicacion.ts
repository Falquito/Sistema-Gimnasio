export interface Medicacion {
  id_medicacion: number;
  farmaco: string;
  dosis: string;
  frecuencia: string;
  indicacion: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: "Activo" | "Suspendido" | "Completado";
}
