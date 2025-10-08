// src/services/dashboard.services.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export type Period = "6semanas" | "6meses" | "1año";

export type EstadisticasResponse = {
  kpis: {
    totalTurnos: number;
    pacientesActivos: { cantidad: number; incremento: number };
    horaPico: { hora: string; promedio: number };
    especialidadTop: { nombre: string; porcentaje: number };
    servicioPrincipal: { nombre: string; cantidad: number };
  };
  turnos: {
    porMes: { mes: string; mes_num: number; total: string | number }[];
    porEstado: { estado: string; total: string | number }[];
    porHora: { hora: string; total: string | number }[];
    promedioSemanal: number;
    promedioMensual: number;
    crecimiento: number;
  };
   pacientes: {
    activos: number;
    inactivos: number;
    total: number;
    porMes: { mes: string; mes_num: number; year: number; nuevos: string | number }[];
    activosPorMes: { mes: string; mes_num: number; year: number; activos: string | number }[]; // 🔥 NUEVO
    nuevosMes: number;
  };
  especialidades: { especialidad: string; total: string | number; porcentaje: string | number }[];
  horarios: {
    distribucion: { hora: string; total: string | number }[];
    pico: string;
    tranquilo: string;
  };
};

export async function getDashboardStats(period: Period = "6semanas"): Promise<EstadisticasResponse> {
  const res = await fetch(`${API_BASE_URL}/turnos/estadisticas?period=${period}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} al cargar estadísticas`);
  return res.json();
}