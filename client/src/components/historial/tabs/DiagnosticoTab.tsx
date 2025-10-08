import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { DiagnosticoModal } from "../modals/DiagnosticoModal";
import type { Paciente } from "@/types/Paciente";
import type { Diagnostico } from "@/types/Diagnostico";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IconPlus, IconCalendar } from "@tabler/icons-react";

interface Props {
  paciente: Paciente;
}

export function DiagnosticoTab({ paciente }: Props) {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // 🔹 Cargar diagnósticos del paciente
  const fetchDiagnosticos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/historia/pacientes/${paciente.id_paciente}/diagnosticos`);
      console.log("🧩 Diagnósticos recibidos:", data);

      // Normalizamos las claves al formato que usa el front
      const normalizados = data.map((d: any) => ({
        id_diagnostico: d.id_diagnostico ?? d.idDiagnostico,
        fecha: d.fecha ?? "-",
        estado: d.estado ?? "-",
        certeza: d.certeza ?? "-",
        codigo_cie: d.codigo_cie ?? d.codigoCIE ?? "-",
        sintomas_principales: d.sintomas_principales ?? d.sintomasPrincipales ?? "-",
        observaciones: d.observaciones ?? "-",
      }));

      setDiagnosticos(normalizados);
    } catch (err) {
      console.error("❌ Error cargando diagnósticos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paciente?.id_paciente) fetchDiagnosticos();
  }, [paciente]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Diagnósticos y Evaluaciones
          </h2>
          <p className="text-sm text-gray-500">
            Historial completo de diagnósticos del paciente
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700"
        >
          <IconPlus size={16} />
          Agregar diagnóstico
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <p className="text-gray-400 text-sm">Cargando diagnósticos...</p>
      ) : diagnosticos.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50">
          No hay diagnósticos registrados.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3">Certeza</th>
                <th className="py-2 px-3">Código CIE</th>
                <th className="py-2 px-3">Síntomas principales</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticos.map((d) => (
                <tr key={d.id_diagnostico} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <IconCalendar size={14} className="text-gray-400" />
                    {d.fecha
                      ? format(new Date(d.fecha), "dd/MM/yyyy", { locale: es })
                      : "-"}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.estado === "ACTIVO"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {d.estado}
                    </span>
                  </td>
                  <td className="py-2 px-3">{d.certeza}</td>
                  <td className="py-2 px-3 font-mono">{d.codigoCIE || "-"}</td>
                  <td className="py-2 px-3 text-gray-700">{d.sintomasPrincipales || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para agregar diagnóstico */}
      <DiagnosticoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        pacienteId={paciente.id_paciente}
        onSaved={fetchDiagnosticos}
      />
    </div>
  );
}
