import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { IconCalendar, IconSearch } from "@tabler/icons-react";

interface Turno {
  id_turno: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string;
  hora_fin: string;
  estado: "Programado" | "Completado" | "Cancelado";
  servicio: string;
  profesional: string;
  duracion: string;
}

interface Props {
  pacienteId: number;
}

export function TurnosTab({ pacienteId }: Props) {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [desde, setDesde] = useState(() => {
    const hoy = new Date();
    const hace12Meses = new Date(hoy);
    hace12Meses.setFullYear(hoy.getFullYear() - 1);
    return hace12Meses.toISOString().split("T")[0];
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split("T")[0]);
  const [servicio, setServicio] = useState("");
  const [profesional, setProfesional] = useState("");

  const getTurnos = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        from: desde,
        to: hasta,
        servicio,
        profesional,
      });
      const res = await apiFetch(`/historia/pacientes/${pacienteId}/turnos?${query.toString()}`);
      const data = await res.json();
      setTurnos(data);
    } catch (err) {
      console.error("Error cargando turnos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) getTurnos();
  }, [pacienteId]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Programado":
        return "text-blue-600";
      case "Completado":
        return "text-green-600";
      case "Cancelado":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <IconCalendar size={18} /> Historial de turnos
          </h3>
          <p className="text-sm text-gray-500">
            Visualización de los turnos programados, completados o cancelados.
          </p>
        </div>

        <button
          onClick={getTurnos}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1"
        >
          <IconSearch size={16} /> Buscar
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <label className="text-gray-600 text-xs">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="text-gray-600 text-xs">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="text-gray-600 text-xs">Servicio</label>
          <input
            type="text"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            placeholder="Ej: Psicología"
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="text-gray-600 text-xs">Profesional</label>
          <input
            type="text"
            value={profesional}
            onChange={(e) => setProfesional(e.target.value)}
            placeholder="Ej: López"
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-400 text-sm mt-4">Cargando turnos...</p>
      ) : turnos.length === 0 ? (
        <p className="text-gray-400 text-sm mt-4">
          No se encontraron turnos para el período seleccionado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Hora</th>
                <th className="p-2 text-left">Duración</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Servicio</th>
                <th className="p-2 text-left">Profesional</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => (
                <tr key={t.id_turno} className="border-b">
                  <td className="p-2 whitespace-nowrap">{t.fecha}</td>
                  <td className="p-2 whitespace-nowrap">
                    {t.hora_inicio} – {t.hora_fin}
                  </td>
                  <td className="p-2">{t.duracion}</td>
                  <td className={`p-2 font-semibold ${getEstadoColor(t.estado)}`}>
                    {t.estado}
                  </td>
                  <td className="p-2">{t.servicio}</td>
                  <td className="p-2">{t.profesional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
