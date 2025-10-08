import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  onSaved?: () => void;
}

export function ObservacionModal({ open, onClose, pacienteId, onSaved }: Props) {
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  });
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const validar = () => {
    if (!texto.trim() || texto.length < 10) {
      alert("La observación debe tener al menos 10 caracteres.");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) return;

    try {
      setLoading(true);
      const payload = { id_paciente: pacienteId, fecha, texto };

      const res = await apiFetch("/historia/observaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      alert("✅ Observación registrada correctamente.");
      onClose();
      onSaved?.();
    } catch (err: any) {
      console.error("❌ Error registrando observación:", err);
      alert("Ocurrió un error al registrar la observación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Registrar observación
          </Dialog.Title>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Fecha *</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Observación *</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm resize-none"
                rows={4}
                placeholder="Escriba aquí la observación clínica..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={loading}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
