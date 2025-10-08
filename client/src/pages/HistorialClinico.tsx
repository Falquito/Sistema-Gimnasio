"use client";

import { useEffect, useState } from "react";
import { pacientesApi } from "../services/pacientesApi";
import { PatientList } from "../components/historial/PatientList";
import { PatientDetail } from "../components/historial/PatientDetail";

interface Paciente {
  id_paciente: number;
  nombre: string;
  apellido: string;
  diagnostico?: string;
  ultimaConsulta?: string;
  estado?: "activo" | "pendiente" | "inactivo";
  telefono?: string;
  email?: string;
  direccion?: string;
  contacto_emergencia?: string;
  fecha_nacimiento?: string;
  genero?: string;
  fecha_alta?: string;
}

export default function HistorialClinico() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar lista de pacientes desde el backend
  useEffect(() => {
    setLoading(true);
    pacientesApi
      .getAll()
      .then((data) => {
        console.log("📥 Datos crudos de pacientes:", data);

        // 🔧 Mapear nombres al formato esperado por PatientList
        const mapped = data.map((p: any) => ({
          id_paciente: p.id_paciente,
          nombre: p.nombre_paciente,      // 👈 cambio clave
          apellido: p.apellido_paciente,  // 👈 cambio clave
          diagnostico: p.diagnostico_principal ?? "Sin diagnóstico",
          ultimaConsulta: p.ultima_consulta ?? "2024-09-28",
          estado: "activo",
          telefono: p.telefono_paciente,
          email: p.email_paciente,
          direccion: p.direccion,
          contacto_emergencia: p.contacto_emergencia,
          fecha_nacimiento: p.fecha_nacimiento,
          genero: p.genero,
          fecha_alta: p.fecha_alta,
        }));

        setPacientes(mapped);
      })
      .catch((err) => {
        console.error("❌ Error cargando pacientes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-12 h-full bg-gray-50">
      {/* 🧍 Lista lateral */}
      <div className="col-span-3 border-r border-gray-200 bg-white overflow-y-auto">
        {loading ? (
          <div className="p-6 text-gray-400 text-center">Cargando pacientes...</div>
        ) : (
          <PatientList
            pacientes={pacientes}
            selected={selectedPaciente}
            onSelect={(p) => setSelectedPaciente(p)}
          />
        )}
      </div>

      {/* 📋 Detalle del paciente */}
      <div className="col-span-9 bg-gray-50 overflow-y-auto">
        <PatientDetail paciente={selectedPaciente} />
      </div>
    </div>
  );
}
