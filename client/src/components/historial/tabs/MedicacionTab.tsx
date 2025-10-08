import { useState, useEffect } from "react";
import { IconPill, IconPlus } from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";
import type { Medicacion } from "@/types/Medicacion";
import { MedicacionModal } from "../modals/MedicacionModal";

interface Props {
  pacienteId: number;
}

export function MedicacionTab({ pacienteId }: Props) {
  const [medicaciones, setMedicaciones] = useState<Medicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const getMedicaciones = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/historia/pacientes/${pacienteId}/medicaciones`);
      const data = await res.json();
      setMedicaciones(data);
    } catch (err) {
      console.error("Error cargando medicaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) getMedicaciones();
  }, [pacienteId]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <IconPill size={18} /> Medicación del paciente
          </h3>
          <p className="text-sm text-gray-500">
            Historial completo de fármacos indicados.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
        >
          <IconPlus size={16} /> Agregar
        </button>
      </div>

      {/* Tabla o lista */}
      {loading ? (
        <p className="text-gray-400 text-sm mt-4">Cargando medicación...</p>
      ) : medicaciones.length === 0 ? (
        <p className="text-gray-400 text-sm mt-4">
          No hay medicación registrada.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Fármaco</th>
                <th className="p-2 text-left">Dosis</th>
                <th className="p-2 text-left">Frecuencia</th>
                <th className="p-2 text-left">Indicación</th>
                <th className="p-2 text-left">Inicio</th>
                <th className="p-2 text-left">Fin</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {medicaciones.map((m) => (
                <tr key={m.id_medicacion} className="border-b">
                  <td className="p-2">{m.farmaco}</td>
                  <td className="p-2">{m.dosis}</td>
                  <td className="p-2">{m.frecuencia}</td>
                  <td className="p-2">{m.indicacion}</td>
                  <td className="p-2">{m.fecha_inicio}</td>
                  <td className="p-2">{m.fecha_fin || "-"}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.estado === "Activo"
                          ? "bg-green-100 text-green-700"
                          : m.estado === "Suspendido"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MedicacionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          pacienteId={pacienteId}
          onSaved={getMedicaciones}
        />
      )}
    </div>
  );
}
