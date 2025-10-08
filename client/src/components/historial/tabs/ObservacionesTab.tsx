import { useState, useEffect } from "react";
import { IconNotes, IconPlus } from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";
import type { Observacion } from "@/types/Observacion";
import { ObservacionModal } from "../modals/ObservacionModal";

interface Props {
  pacienteId: number;
}

export function ObservacionesTab({ pacienteId }: Props) {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const getObservaciones = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/historia/pacientes/${pacienteId}/observaciones`);
      const data = await res.json();
      setObservaciones(data);
    } catch (err) {
      console.error("Error cargando observaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) getObservaciones();
  }, [pacienteId]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <IconNotes size={18} /> Observaciones clínicas
          </h3>
          <p className="text-sm text-gray-500">
            Registro de valoraciones y comentarios del profesional.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
        >
          <IconPlus size={16} /> Agregar
        </button>
      </div>

      {/* Tabla / lista */}
      {loading ? (
        <p className="text-gray-400 text-sm mt-4">Cargando observaciones...</p>
      ) : observaciones.length === 0 ? (
        <p className="text-gray-400 text-sm mt-4">No hay observaciones registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Profesional</th>
                <th className="p-2 text-left">Servicio</th>
                <th className="p-2 text-left">Observación</th>
              </tr>
            </thead>
            <tbody>
              {observaciones.map((o) => (
                <tr key={o.id_observacion} className="border-b align-top">
                  <td className="p-2 whitespace-nowrap">{o.fecha}</td>
                  <td className="p-2 whitespace-nowrap">{o.profesional}</td>
                  <td className="p-2 whitespace-nowrap">{o.servicio || "-"}</td>
                  <td className="p-2">{o.texto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ObservacionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          pacienteId={pacienteId}
          onSaved={getObservaciones}
        />
      )}
    </div>
  );
}
