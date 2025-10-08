
// src/components/dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getDashboardStats, type EstadisticasResponse } from "../../services/dashboard.services";
import { KPICards } from "./KPICards";
import { TabNavigation } from "./TabNavigation";
import { PeriodSelector } from "./PeriodSelector"
import { TurnosTab } from "./tabs/TurnosTab";
import { PacientesTab } from "./tabs/PacientesTab";
import { HorariosTab } from "./tabs/HorariosTab";
import { EspecialidadesTab } from "./tabs/EspecialidadesTab";

type Tab = "turnos" | "pacientes" | "horarios" | "especialidades" | "servicios";
export type Period = "6semanas" | "6meses" | "1año";

export default function Dashboard() {
  const [data, setData] = useState<EstadisticasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("turnos");
  const [period, setPeriod] = useState<Period>("6semanas");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await getDashboardStats(period);
        console.log("Datos recibidos del backend:", resp);
        if (mounted) setData(resp);
      } catch (e: any) {
        console.error("Error cargando estadísticas:", e);
        if (mounted) setError(e?.message ?? "Error cargando estadísticas");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [period]); // 🔥 Re-fetch cuando cambia el período

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <p className="font-semibold">Error: {error}</p>
          <p className="text-sm mt-2">Revisa la consola del navegador para más detalles</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
            <p className="text-sm text-gray-600">Análisis completo de tu práctica profesional</p>
          </div>
          
          {/* Selector de período */}
          <PeriodSelector period={period} onPeriodChange={setPeriod} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs principales */}
        <KPICards data={data} />

        {/* Navegación por pestañas */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenido según pestaña activa */}
        <div className="mt-6">
          {activeTab === "turnos" && <TurnosTab data={data} />}
          {activeTab === "pacientes" && <PacientesTab data={data} />}
          {activeTab === "horarios" && <HorariosTab data={data} />}
          {activeTab === "especialidades" && <EspecialidadesTab data={data} />}
      
        </div>
      </div>
    </div>
  );
}
