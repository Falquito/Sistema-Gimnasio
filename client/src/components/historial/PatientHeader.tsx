import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IconUser, IconCalendar, IconHeartbeat } from "@tabler/icons-react";
import type { Paciente } from "@/types/Paciente";



interface Props {
  paciente: Paciente;
}

export function PatientHeader({ paciente }: Props) {
  const {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    fecha_alta,
    estado,
    id_paciente,
  } = paciente;

  const edad = fecha_nacimiento
    ? Math.floor(
        (Date.now() - new Date(fecha_nacimiento).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  return (
    <div className="bg-white p-6 border-b border-gray-200">
      {/* Encabezado principal */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {nombre} {apellido}
        </h1>

        {estado && (
          <span
            className={`text-sm px-2 py-0.5 rounded-full font-medium ${
              estado === "activo"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {estado === "activo" ? "Activo" : "Inactivo"}
          </span>
        )}
      </div>

      {/* Datos secundarios */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-2">
        {edad && genero && (
          <div className="flex items-center gap-1">
            <IconUser size={16} />
            {edad} años · {genero}
          </div>
        )}
        {fecha_alta && (
          <div className="flex items-center gap-1">
            <IconCalendar size={16} />
            Paciente desde{" "}
            {format(new Date(fecha_alta), "MMM yyyy", { locale: es })}
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <IconHeartbeat size={16} />
          ID: #PAC-{id_paciente.toString().padStart(4, "0")}
        </div>
      </div>
    </div>
  );
}
