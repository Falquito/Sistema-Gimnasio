import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Paciente } from "@/types/Paciente";


interface Props {
  pacientes: Paciente[];
  selected: Paciente | null;
  onSelect: (p: Paciente) => void;
}

export function PatientList({ pacientes, selected, onSelect }: Props) {
  const [search, setSearch] = useState("");

  // Filtro por texto
  const filtered = pacientes.filter((p) => {
    const fullName = `${p.nombre ?? ""} ${p.apellido ?? ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-500";
      case "pendiente":
        return "bg-yellow-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Pacientes</h2>
        <p className="text-sm text-gray-500">
          {filtered.length} pacientes activos
        </p>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-100 outline-none"
        />
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((p) => {
          const isSelected = selected?.id_paciente === p.id_paciente;
          const iniciales = `${p.nombre?.[0] ?? ""}${p.apellido?.[0] ?? ""}`.toUpperCase();

          const fecha = p.ultimaConsulta
            ? format(new Date(p.ultimaConsulta), "yyyy-MM-dd", { locale: es })
            : null;

          return (
            <div
              key={p.id_paciente}
              onClick={() => onSelect(p)}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition mb-1 ${
                isSelected ? "bg-emerald-50 border border-emerald-300" : "hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500 text-white font-medium text-sm flex-shrink-0">
                {iniciales}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">
                    {p.nombre || "(Sin nombre)"} {p.apellido || ""}
                  </p>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ml-2 ${getEstadoColor(
                      p.estado
                    )}`}
                  />
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {p.diagnostico || "Sin diagnóstico"}
                </p>
                {fecha && (
                  <p className="text-xs text-gray-400 mt-1">{fecha}</p>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No se encontraron pacientes
          </p>
        )}
      </div>
    </div>
  );
}
