// src/components/historial/tabs/ResumenTab.tsx
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconUserHeart,
  IconPill,
} from "@tabler/icons-react";
import type { Paciente } from "@/types/Paciente";

interface Medicacion {
  id: number;
  farmaco: string;
  dosis?: string;
  frecuencia?: string;
  estado?: string; // activo, suspendido, completado
}

interface Props {
  paciente: Paciente & {
    medicaciones?: Medicacion[];
  };
}

export function ResumenTab({ paciente }: Props) {
  const {
    fecha_nacimiento,
    telefono,
    email,
    direccion,
    diagnostico,
    medicaciones = [],
  } = paciente;

  const edad = fecha_nacimiento
    ? Math.floor(
        (Date.now() - new Date(fecha_nacimiento).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  // Filtramos solo las medicaciones activas
  const medicacionesActivas = medicaciones.filter(
    (m) => m.estado?.toLowerCase() === "activo"
  );

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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm">
            {diagnostico || "Sin diagnóstico registrado"}
          </p>
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
                key={m.id}
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
