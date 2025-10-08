import { useState } from "react";
import { PatientHeader } from "./PatientHeader";
import { ResumenTab } from "./tabs/ResumenTab";
import { TurnosTab } from "./tabs/TurnosTab";
import { DiagnosticoTab } from "./tabs/DiagnosticoTab";
import { MedicacionTab } from "./tabs/MedicacionTab";
import { ObservacionesTab } from "./tabs/ObservacionesTab";
import type { Paciente } from "@/types/Paciente";

interface Props {
  paciente: Paciente | null;
}

export function PatientDetail({ paciente }: Props) {
  const [activeTab, setActiveTab] = useState("resumen");

  if (!paciente) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Selecciona un paciente para ver su información.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PatientHeader paciente={paciente} />

      {/* Tabs */}
      <div className="flex border-b bg-gray-50 px-6">
        {[
          { id: "resumen", label: "Resumen" },
          { id: "turnos", label: "Turnos" }, // 👈 Nuevo tab
          { id: "diagnostico", label: "Diagnóstico" },
          { id: "medicacion", label: "Medicación" },
          { id: "observaciones", label: "Observaciones" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              activeTab === tab.id
                ? "bg-white border border-b-0 border-gray-300 text-emerald-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de cada tab */}
      <div className="flex-1 bg-white border border-t-0 border-gray-300 overflow-y-auto">
        {activeTab === "resumen" && <ResumenTab paciente={paciente} />}
        {activeTab === "turnos" && (
          <TurnosTab pacienteId={paciente.id_paciente} /> // 👈 Nuevo tab funcional
        )}
        {activeTab === "diagnostico" && <DiagnosticoTab paciente={paciente} />}
        {activeTab === "medicacion" && (
          <MedicacionTab pacienteId={paciente.id_paciente} />
        )}
        {activeTab === "observaciones" && (
          <ObservacionesTab pacienteId={paciente.id_paciente} profesionalId={1} />
        )}
      </div>
    </div>
  );
}
