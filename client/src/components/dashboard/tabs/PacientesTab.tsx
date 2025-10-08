// src/components/dashboard/tabs/PacientesTab.tsx
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { EstadisticasResponse } from "../../../services/dashboard.services";
import { MetricCard } from "../MetricCard";

interface Props {
  data: EstadisticasResponse;
}

const MESES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function PacientesTab({ data }: Props) {
  const pacientesPorMes = data?.pacientes?.porMes || [];
  const activosPorMes = data?.pacientes?.activosPorMes || [];
  
  // 🔥 Combinar datos reales de nuevos y activos por mes
  const chartData = useMemo(() => {
  if (activosPorMes.length === 0) return [];

  return activosPorMes.map((activo) => {
    const nuevos = pacientesPorMes.find(
      p => Number(p.mes_num) === Number(activo.mes_num) && Number(p.year) === Number(activo.year)
    );
    
    const activosNum = Number(activo.activos);
    const nuevosNum = nuevos ? Number(nuevos.nuevos) : 0;
    
    return {
      mes: MESES_ES[Number(activo.mes_num) - 1]?.slice(0, 3) || activo.mes,
      activos: activosNum,        // Pacientes que vinieron ese mes
      nuevos: nuevosNum,          // Pacientes que vinieron por primera vez
      recurrentes: activosNum - nuevosNum, // Los que ya venían de antes
    };
  });
}, [activosPorMes, pacientesPorMes]);

  return (
    <div className="space-y-6">
      {/* Gráfico principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Evolución de Pacientes
          </h2>
          <p className="text-sm text-gray-500">Pacientes nuevos, activos y total por mes</p>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: "12px" }} />
    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: "white", 
        border: "1px solid #e5e7eb",
        borderRadius: "8px" 
      }} 
    />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="activos" 
      stroke="#3b82f6" 
      strokeWidth={2}
      dot={{ r: 4 }}
      name="Total del mes"
    />
    <Line 
      type="monotone" 
      dataKey="nuevos" 
      stroke="#10b981" 
      strokeWidth={2}
      dot={{ r: 4 }}
      name="Nuevos"
    />
    <Line 
      type="monotone" 
      dataKey="recurrentes" 
      stroke="#f59e0b" 
      strokeWidth={2}
      dot={{ r: 4 }}
      name="Recurrentes"
    />
  </LineChart>
</ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>

      {/* Métricas inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Pacientes Nuevos"
          value={data?.pacientes?.nuevosMes || 0}
          subtitle="este mes"
        />
        <MetricCard
          title="Pacientes Activos"
          value={data?.pacientes?.activos || 0}
          subtitle="en tratamiento"
        />
        <MetricCard
          title="Total Acumulado"
          value={data?.pacientes?.total || 0}
          subtitle="pacientes registrados"
        />
      </div>
    </div>
  );
}