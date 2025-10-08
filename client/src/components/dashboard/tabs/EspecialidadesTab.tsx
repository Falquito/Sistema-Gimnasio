
// src/components/dashboard/tabs/EspecialidadesTab.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { EstadisticasResponse } from "../../../services/dashboard.services";

interface Props {
  data: EstadisticasResponse;
}

export function EspecialidadesTab({ data }: Props) {
  // 🔧 Protección contra datos undefined
  const especialidades = data?.especialidades || [];
  
  const chartData = especialidades.map((item) => ({
    nombre: item.especialidad,
    cantidad: Number(item.total),
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Especialidades Más Concurridas
          </h2>
          <p className="text-sm text-gray-500">Distribución de turnos por tipo de terapia</p>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis 
                type="category" 
                dataKey="nombre" 
                width={150}
                stroke="#6b7280" 
                style={{ fontSize: "12px" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px" 
                }} 
              />
              <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>

      {/* Detalle por Especialidad */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          Detalle por Especialidad
        </h3>
        <p className="text-sm text-gray-500 mb-4">Cantidad y porcentaje de turnos</p>
        
        {especialidades.length > 0 ? (
          <div className="space-y-2">
            {especialidades.map((esp, idx) => (
              <EspecialidadItem
                key={idx}
                nombre={esp.especialidad}
                cantidad={Number(esp.total)}
                porcentaje={Number(esp.porcentaje)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No hay especialidades registradas
          </div>
        )}
      </div>
    </div>
  );
}

function EspecialidadItem({ nombre, cantidad, porcentaje }: {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900">{nombre}</span>
          <span className="text-sm text-gray-600">{cantidad} turnos ({porcentaje}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
