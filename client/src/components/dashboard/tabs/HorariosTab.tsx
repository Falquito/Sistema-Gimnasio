// src/components/dashboard/tabs/HorariosTab.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { EstadisticasResponse } from "../../../services/dashboard.services";

interface Props {
  data: EstadisticasResponse;
}

export function HorariosTab({ data }: Props) {
  const distribucion = data?.horarios?.distribucion || [];
  
  const chartData = distribucion.map((item) => ({
    hora: item.hora,
    cantidad: Number(item.total),
  }));

  // 🔥 MEJORADO: Horario pico
  const horaPico = distribucion.length > 0
    ? distribucion.reduce((max, curr) => 
        Number(curr.total) > Number(max.total) ? curr : max
      )
    : { hora: '16:00', total: 0 };

  // 🔥 MEJORADO: Horario tranquilo (el mínimo, excluyendo 0)
  const horariosConTurnos = distribucion.filter(h => Number(h.total) > 0);
  const horaTranquilo = horariosConTurnos.length > 0
    ? horariosConTurnos.reduce((min, curr) => 
        Number(curr.total) < Number(min.total) ? curr : min
      )
    : { hora: '13:00', total: 0 };

  // 🔥 MEJORADO: Franja más activa (2 horas consecutivas en vez de 3)
  let maxSuma = 0;
  let franjaInicio = distribucion[0]?.hora || "15:00";
  let franjaFin = distribucion[1]?.hora || "17:00";
  
  for (let i = 0; i < distribucion.length - 1; i++) {
    const suma = Number(distribucion[i].total) + Number(distribucion[i + 1]?.total || 0);
    
    if (suma > maxSuma) {
      maxSuma = suma;
      franjaInicio = distribucion[i].hora;
      franjaFin = distribucion[i + 1].hora;
    }
  }

  return (
    <div className="space-y-6">
      {/* Gráfico principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Horas Más Concurridas
          </h2>
          <p className="text-sm text-gray-500">Distribución de turnos por horario del día</p>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hora" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px" 
                }} 
              />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>

      {/* Análisis de Horarios */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          Análisis de Horarios
        </h3>
        <p className="text-sm text-gray-500 mb-4">Franjas horarias con mayor demanda</p>
        
        <div className="space-y-3">
          <HorarioItem
            label="Horario Pico"
            subtitle="Mayor cantidad de turnos"
            value={horaPico.hora}
            count={`${horaPico.total} turnos`}
          />
          <HorarioItem
            label="Horario Tranquilo"
            subtitle="Menor cantidad de turnos"
            value={horaTranquilo.hora}
            count={`${horaTranquilo.total} turno${Number(horaTranquilo.total) === 1 ? '' : 's'}`}
          />
          <HorarioItem
            label="Franja Más Activa"
            subtitle="Período de 2 horas con mayor actividad"
            value={`${franjaInicio} - ${franjaFin}`}
            count={`${maxSuma} turnos`}
          />
        </div>
      </div>
    </div>
  );
}

function HorarioItem({ label, subtitle, value, count }: {
  label: string;
  subtitle: string;
  value: string;
  count: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{count}</div>
      </div>
    </div>
  );
}