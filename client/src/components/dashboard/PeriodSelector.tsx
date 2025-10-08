// src/components/dashboard/PeriodSelector.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export type Period = "6semanas" | "6meses" | "1año";

interface Props {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: "6semanas", label: "Últimas 6 semanas" },
  { value: "6meses", label: "Últimos 6 meses" },
  { value: "1año", label: "Último año" },
];

export function PeriodSelector({ period, onPeriodChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = periods.find(p => p.value === period)?.label || "Últimas 6 semanas";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
         
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
         
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  onPeriodChange(p.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  period === p.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
