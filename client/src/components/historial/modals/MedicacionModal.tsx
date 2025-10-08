import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  onSaved?: () => void;
}

export function MedicacionModal({ open, onClose, pacienteId, onSaved }: Props) {
  // ---------- ESTADOS ----------
  const [farmaco, setFarmaco] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [indicacion, setIndicacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState(() => {
    const hoy = new Date();
    const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  });
  const [fechaFin, setFechaFin] = useState<string>("");
  const [estado, setEstado] = useState("Activo");
  const [loading, setLoading] = useState(false);

  // ---------- VALIDACIÓN ----------
  const validar = () => {
    if (!farmaco.trim()) {
      alert("Debe ingresar el nombre del fármaco.");
      return false;
    }
    if (!dosis.trim()) {
      alert("Debe especificar la dosis.");
      return false;
    }
    if (!frecuencia.trim()) {
      alert("Debe especificar la frecuencia de administración.");
      return false;
    }
    if (!indicacion.trim() || indicacion.length < 5) {
      alert("Debe ingresar una indicación válida (mínimo 5 caracteres).");
      return false;
    }
    return true;
  };

  // ---------- GUARDAR ----------
  const handleGuardar = async () => {
    if (!validar()) return;

    try {
      setLoading(true);

      const payload = {
        id_paciente: pacienteId,
        farmaco,
        dosis,
        frecuencia,
        indicacion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin || null,
        estado: estado.toUpperCase(), // "ACTIVO", "SUSPENDIDO", "COMPLETADO"
      };

      console.log("📤 Enviando medicación:", payload);

      const res = await apiFetch("/historia/medicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      alert("✅ Medicación registrada correctamente.");
      onClose();
      onSaved?.();
    } catch (err: any) {
      console.error("❌ Error registrando medicación:", err);
      alert("Ocurrió un error al registrar la medicación.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Contenedor */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Registrar medicación
          </Dialog.Title>

          {/* Campos del formulario */}
          <div className="space-y-3">
            {/* Fármaco */}
            <div>
              <label className="text-sm text-gray-600">Fármaco *</label>
              <input
                type="text"
                value={farmaco}
                onChange={(e) => setFarmaco(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm"
                placeholder="Ej: Paracetamol"
                required
              />
            </div>

            {/* Dosis y frecuencia */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Dosis *</label>
                <input
                  type="text"
                  value={dosis}
                  onChange={(e) => setDosis(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  placeholder="Ej: 500 mg"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Frecuencia *</label>
                <input
                  type="text"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  placeholder="Ej: Cada 8 horas"
                  required
                />
              </div>
            </div>

            {/* Indicación */}
            <div>
              <label className="text-sm text-gray-600">Indicación *</label>
              <textarea
                value={indicacion}
                onChange={(e) => setIndicacion(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm resize-none"
                rows={2}
                placeholder="Motivo de la medicación o diagnóstico asociado"
                required
              />
            </div>

            {/* Fechas */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Fecha inicio *</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-600">Fecha fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="text-sm text-gray-600">Estado *</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm"
              >
                <option>Activo</option>
                <option>Suspendido</option>
                <option>Completado</option>
              </select>
            </div>
          </div>

          {/* Botones */}
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
