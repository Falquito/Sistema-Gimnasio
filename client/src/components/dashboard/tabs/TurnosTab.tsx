// src/components/dashboard/tabs/TurnosTab.tsx
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { EstadisticasResponse } from "../../../services/dashboard.services";
import { MetricCard } from "../MetricCard";

interface Props {
  data: EstadisticasResponse;
}

const MESES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function TurnosTab({ data }: Props) {
  // 🔧 Protección contra datos undefined
  const turnosPorMes = data?.turnos?.porMes || [];
  
  const chartData = turnosPorMes.map((item) => ({
    mes: MESES_ES[Number(item.mes_num) - 1]?.slice(0, 3) || item.mes,
    cantidad: Number(item.total),
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cantidad de Turnos en el Tiempo
          </h2>
          <p className="text-sm text-gray-500">Evolución de turnos mensuales</p>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTurnos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="cantidad"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTurnos)"
              />
            </AreaChart>
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
          title="Promedio Semanal"
          value={data?.turnos?.promedioSemanal || 0}
          subtitle="turnos por semana"
        />
        <MetricCard
          title="Promedio Mensual"
          value={data?.turnos?.promedioMensual || 0}
          subtitle="turnos por mes"
        />
        <MetricCard
          title="Crecimiento"
          value={`${(data?.turnos?.crecimiento || 0) > 0 ? "+" : ""}${data?.turnos?.crecimiento || 0}%`}
          subtitle="vs período anterior"
          trend={(data?.turnos?.crecimiento || 0) > 0 ? "up" : (data?.turnos?.crecimiento || 0) < 0 ? "down" : undefined}
        />
      </div>
    </div>
  );
}
