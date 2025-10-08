import { useState } from "react";

interface Props {
  onTabChange: (tab: string) => void;
}

export function PatientTabs({ onTabChange }: Props) {
  const [activeTab, setActiveTab] = useState("resumen");

  const tabs = [
    { id: "resumen", label: "Resumen" },
    { id: "turnos", label: "Turnos" }, // 👈 Nuevo tab agregado
    { id: "diagnostico", label: "Diagnóstico" },
    { id: "medicacion", label: "Medicación" },
    { id: "observaciones", label: "Observaciones" },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onTabChange(id);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6">
      <div className="flex gap-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            aria-selected={activeTab === tab.id}
            className={`text-sm font-medium px-3 py-2 rounded-md transition ${
              activeTab === tab.id
                ? "bg-white border border-gray-300 shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
