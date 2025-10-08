import { useState, useEffect } from "react";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconUserHeart,
  IconPill,
} from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";
import type { Paciente } from "@/types/Paciente";
import type { Medicacion } from "@/types/Medicacion";
import type { Diagnostico } from "@/types/Diagnostico";

interface Props {
  paciente: Paciente;
}

export function ResumenTab({ paciente }: Props) {
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [medicaciones, setMedicaciones] = useState<Medicacion[]>([]);
  const [loading, setLoading] = useState(true);

  const { fecha_nacimiento, telefono, email, direccion } = paciente;

  const edad = fecha_nacimiento
    ? Math.floor(
        (Date.now() - new Date(fecha_nacimiento).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  // 🔹 Cargar diagnóstico y medicaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🩺 1️⃣ Diagnóstico más reciente
        const diagResp = await apiFetch(
          `/historia/pacientes/${paciente.id_paciente}/diagnosticos`
        );
        console.log("🧩 Diagnósticos recibidos en ResumenTab:", diagResp);

        let ultimoDiag: Diagnostico | null = null;

        if (Array.isArray(diagResp) && diagResp.length > 0) {
          // Normalizamos las claves
          const normalizados = diagResp.map((d: any) => ({
            id_diagnostico: d.id_diagnostico ?? d.idDiagnostico,
            id_paciente: d.id_paciente ?? d.idPaciente ?? paciente.id_paciente, // 👈 agregado
            fecha: d.fecha ?? "-",
            estado: d.estado ?? "-",
            certeza: d.certeza ?? "-",
            codigo_cie: d.codigo_cie ?? d.codigoCIE ?? "-",
            sintomas_principales:
              d.sintomas_principales ?? d.sintomasPrincipales ?? "-",
            observaciones: d.observaciones ?? d.observacion ?? "-",
          }));

          // Ordenamos por fecha descendente
          ultimoDiag = normalizados.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          )[0];
        }

        // 💊 2️⃣ Medicaciones
        const medsResp = await apiFetch(
          `/historia/pacientes/${paciente.id_paciente}/medicaciones`
        );
        console.log("💊 Medicaciones recibidas en ResumenTab:", medsResp);

        const meds = medsResp?.data || medsResp || [];

        setDiagnostico(ultimoDiag);
        setMedicaciones(meds);
      } catch (err) {
        console.error("❌ Error cargando resumen:", err);
      } finally {
        setLoading(false);
      }
    };

    if (paciente?.id_paciente) fetchData();
  }, [paciente]);

  const medicacionesActivas = medicaciones.filter(
    (m) => m.estado?.toUpperCase() === "ACTIVO"
  );

  if (loading) return <p className="p-6 text-gray-500">Cargando resumen...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Información básica */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Información de contacto
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="flex items-center gap-2">
              <IconPhone size={16} /> {telefono || "No registrado"}
            </p>
            <p className="flex items-center gap-2 mt-2">
              <IconMail size={16} /> {email || "No registrado"}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2">
              <IconMapPin size={16} /> {direccion || "No registrada"}
            </p>
            {edad && (
              <p className="flex items-center gap-2 mt-2">
                <IconUserHeart size={16} /> {edad} años
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Diagnóstico actual */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Diagnóstico actual
        </h3>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <IconUserHeart size={18} className="text-black" />
              Diagnóstico actual
            </h3>

            {diagnostico ? (
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold text-gray-800">
                      {diagnostico.fecha
                        ? new Date(diagnostico.fecha).toLocaleDateString("es-AR")
                        : "-"}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        diagnostico.estado === "ACTIVO"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {diagnostico.estado || "SIN ESTADO"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Síntomas principales</p>
                    <p className="font-medium text-gray-800">
                      {diagnostico.sintomas_principales || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Certeza</p>
                    <p className="font-medium text-gray-800">
                      {diagnostico.certeza || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Código CIE</p>
                    <p className="font-mono text-gray-800">
                      {diagnostico.codigo_cie || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Observaciones</p>
                    <p className="font-medium text-gray-800">
                      {diagnostico.observaciones || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-gray-500 text-sm">
                Sin diagnóstico registrado.
              </div>
            )}
          </section>

        </div>
      </section>

      {/* Medicación actual */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Medicación actual
        </h3>
        {medicacionesActivas.length > 0 ? (
          <div className="space-y-2">
            {medicacionesActivas.map((m) => (
              <div
                key={m.idMedicacion}
                className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm"
              >
                <IconPill size={16} className="text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">{m.farmaco}</p>
                  <p className="text-gray-600">
                    {m.dosis || ""} {m.frecuencia ? `· ${m.frecuencia}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hay medicaciones activas registradas.
          </p>
        )}
      </section>
    </div>
  );
}
