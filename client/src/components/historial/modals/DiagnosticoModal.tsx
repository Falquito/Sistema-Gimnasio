import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "@/lib/api";
import type { Diagnostico } from "@/types/Diagnostico";

interface Props {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  diagnosticos?: Diagnostico[];
  onSaved?: () => void;
}

export function DiagnosticoModal({
  open,
  onClose,
  pacienteId,
  diagnosticos = [],
  onSaved,
}: Props) {
  // ---------- ESTADOS ----------
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  });

  const [estado, setEstado] = useState("Activo");
  const [certeza, setCerteza] = useState("En estudio");
  const [codigoCIE, setCodigoCIE] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- EFECTO: consistencia clínica ----------
  useEffect(() => {
    if (certeza === "Descartado") setEstado("Cerrado");
  }, [certeza]);

  // ---------- VALIDACIÓN ----------
  const validar = () => {
    if (!fecha) {
      alert("Debe ingresar una fecha válida.");
      return false;
    }

    if (!codigoCIE.trim()) {
      alert("Debe ingresar un código CIE.");
      return false;
    }

    if (sintomas.trim().length < 10) {
      alert("La descripción de síntomas debe tener al menos 10 caracteres.");
      return false;
    }

    const duplicado = diagnosticos.some(
      (d) => d.codigo_cie === codigoCIE && d.estado === "ACTIVO"
    );
    if (duplicado) {
      alert("⚠️ Ya existe un diagnóstico activo con este código CIE.");
      return false;
    }

    return true;
  };

  // ---------- GUARDAR ----------
  const handleGuardar = async () => {
    if (!validar()) return;

    try {
      setLoading(true);

      const fechaFinal = new Date(fecha).toISOString().split("T")[0];

      // 🧠 Payload conforme al DTO del backend
      const payload = {
        fecha: fechaFinal,
        estado: estado.toUpperCase(), // "ACTIVO" / "CERRADO"
        certeza: certeza.toUpperCase().replace(" ", "_"), // "EN_ESTUDIO", "CONFIRMADO", etc.
        codigoCIE: codigoCIE,
        sintomasPrincipales: sintomas,
        observaciones: observaciones || undefined,
        idPaciente: Number(pacienteId), // ✅ requerido por el DTO
        idProfesional: 1, // ⚠️ reemplazá por el id del usuario logueado o quitá si lo obtiene del token
      };

      console.log("📤 Enviando diagnóstico:", payload);

      const response = await apiFetch("/historia/diagnosticos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert(`❌ Error al guardar diagnóstico (${response.status})`);
        return;
      }

      alert("✅ Diagnóstico registrado correctamente.");
      onClose();
      onSaved?.();
    } catch (err: any) {
      console.error("❌ Error guardando diagnóstico:", err);
      alert("Ocurrió un error al registrar el diagnóstico.");
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
            Registrar diagnóstico
          </Dialog.Title>

          {/* Campos */}
          <div className="space-y-3">
            {/* Fecha */}
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

            {/* Estado y Certeza */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Estado *</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  disabled={certeza === "Descartado"}
                >
                  <option>Activo</option>
                  <option>Cerrado</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-600">Certeza *</label>
                <select
                  value={certeza}
                  onChange={(e) => setCerteza(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                >
                  <option>En estudio</option>
                  <option>Confirmado</option>
                  <option>Descartado</option>
                </select>
              </div>
            </div>

            {/* Código CIE */}
            <div>
              <label className="text-sm text-gray-600">Código CIE *</label>
              <input
                type="text"
                value={codigoCIE}
                onChange={(e) => setCodigoCIE(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm"
                placeholder="Ej: F41.1"
              />
            </div>

            {/* Síntomas */}
            <div>
              <label className="text-sm text-gray-600">
                Síntomas principales *
              </label>
              <textarea
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm resize-none"
                rows={3}
                placeholder="Describa los síntomas principales..."
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="text-sm text-gray-600">Observaciones</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-sm resize-none"
                rows={2}
                placeholder="Notas adicionales (opcional)..."
              />
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
