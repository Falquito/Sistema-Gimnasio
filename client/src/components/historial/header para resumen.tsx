import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Paciente {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono_paciente?: string;
  email_paciente?: string;
  direccion?: string;
  contacto_emergencia?: string;
  diagnostico_actual?: string;
  fecha_alta?: string;
  estado?: "activo" | "inactivo";
}

interface Props {
  paciente: Paciente;
}

export function PatientHeader({ paciente }: Props) {
  const {
    nombre_paciente,
    apellido_paciente,
    fecha_nacimiento,
    genero,
    telefono_paciente,
    email_paciente,
    direccion,
    contacto_emergencia,
    diagnostico_actual,
    fecha_alta,
    estado,
  } = paciente;

  const edad = fecha_nacimiento
    ? Math.floor(
        (Date.now() - new Date(fecha_nacimiento).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
      {/* Nombre y estado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {nombre_paciente} {apellido_paciente}
        </h2>

        {estado && (
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              estado === "activo"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {estado === "activo" ? "Activo" : "Inactivo"}
          </span>
        )}
      </div>

      {/* Datos básicos */}
      {/* <div className="text-sm text-gray-600 flex flex-wrap gap-4">
        {edad && <p>🎂 {edad} años</p>}
        {genero && <p>• {genero}</p>}
        {fecha_alta && (
          <p>
            📅 Paciente desde{" "}
            {format(new Date(fecha_alta), "MMM yyyy", { locale: es })}
          </p>
        )}
        <p className="text-gray-400">ID: #{paciente.id_paciente}</p>
      </div> */}

      {/* Información de contacto */}
      {/* <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-700 mb-1">Teléfono</p>
          <p className="text-gray-600">{telefono_paciente || "-"}</p>
          <p className="font-medium text-gray-700 mt-3 mb-1">Email</p>
          <p className="text-gray-600">{email_paciente || "-"}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-1">Dirección</p>
          <p className="text-gray-600">{direccion || "-"}</p>
          <p className="font-medium text-gray-700 mt-3 mb-1">
            Contacto de emergencia
          </p>
          <p className="text-gray-600">{contacto_emergencia || "-"}</p>
        </div>
      </div> */}

      {/* Diagnóstico actual */}
      {/* {diagnostico_actual && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
          <p className="font-medium text-blue-700 mb-1">Diagnóstico actual</p>
          <p className="text-sm text-gray-700">{diagnostico_actual}</p>
        </div>
      )} */}
    </div>
  );
}
