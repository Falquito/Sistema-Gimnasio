// components/PatientSelect.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Search, UserRound, Check, User, Phone, Mail, MapPin, Calendar, ChevronDown, X, Plus } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "../ui/animated-modal";

// ⬇️ cambia esta ruta si tu archivo tiene otro nombre/ubicación
import {
  buscarPacientes,
  getPacienteById,
  type PacienteListItem,
} from "../../services/pacientes.services";

type Props = {
  value?: number | null;
  onChange: (id: number, display?: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onCreateNew?: () => void; // Para poder crear paciente desde aquí
};

export const PatientSelect: React.FC<Props> = ({
  value,
  onChange,
  label = "Paciente",
  placeholder = "Seleccionar paciente",
  error,
  required = false,
  onCreateNew,
}) => {
  const [display, setDisplay] = useState(placeholder);
  const [loading, setLoading] = useState(false);

  // Si viene un id preseleccionado, traigo el nombre para mostrar
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!value) {
        setDisplay(placeholder);
        return;
      }
      try {
        setLoading(true);
        const p = await getPacienteById(value);
        if (mounted) {
          setDisplay(`${p.apellido_paciente} ${p.nombre_paciente}`.trim());
        }
      } catch {
        if (mounted) setDisplay(`ID: ${value}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [value, placeholder]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(0);
    setDisplay(placeholder);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <User className="w-4 h-4 text-green-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <Modal>
        <ModalTrigger 
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            error 
              ? 'border-red-300 bg-red-50' 
              : value 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            {value ? (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {display.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
            <span className={`${value ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {loading ? "Cargando..." : display}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {value && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                title="Limpiar selección"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </ModalTrigger>

        <ModalBody className="bg-white md:rounded-2xl md:max-w-[800px]">
          <InnerPatientPicker
            onPick={(p) => {
              const name = `${p.apellido_paciente} ${p.nombre_paciente}`.trim();
              onChange(p.id_paciente, name);
            }}
            onCreateNew={onCreateNew}
          />
        </ModalBody>
      </Modal>

      {error && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const InnerPatientPicker = ({
  onPick,
  onCreateNew,
}: {
  onPick: (p: PacienteListItem) => void;
  onCreateNew?: () => void;
}) => {
  const { setOpen } = useModal();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PacienteListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Carga inicial: si no hay término, traigo todos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await buscarPacientes(""); // ← lista todo si q=""
        if (mounted) setResults(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const search = async (term: string) => {
    setQ(term);
    setSelectedIndex(-1);
    try {
      setLoading(true);
      const data = await buscarPacientes(term); // server-side (si hay ?q) o client-side fallback
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        onPick(selected);
        setOpen(false);
      }
    }
  };

  const getInitials = (nombre: string, apellido: string) => {
    return `${apellido?.[0] || ''}${nombre?.[0] || ''}`.toUpperCase();
  };

  const calculateAge = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return null;
    const today = new Date();
    const birth = new Date(fechaNacimiento);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <ModalContent className="p- bg-white">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Seleccionar Paciente
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {results.length > 0 ? `${results.length} pacientes disponibles` : 'Busca por nombre, apellido o DNI'}
            </p>
          </div>
          
          {onCreateNew && (
            <button
              onClick={() => {
                onCreateNew();
                setOpen(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Paciente
            </button>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => search(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre, apellido o DNI…"
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 transition-all duration-200"
          />
          {q && (
            <button
              onClick={() => search("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de resultados */}
      <div className="px-6 pb-6">
        <div className="max-h-[400px] overflow-auto space-y-2">
          {loading && (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Buscando pacientes...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">No se encontraron pacientes</p>
              <p className="text-gray-500 text-sm">
                {q ? `No hay resultados para "${q}"` : 'No hay pacientes registrados'}
              </p>
              {onCreateNew && (
                <button
                  onClick={() => {
                    onCreateNew();
                    setOpen(false);
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Crear Nuevo Paciente
                </button>
              )}
            </div>
          )}

          {results.map((p, index) => {
            const age = calculateAge(p.fecha_nacimiento);
            const isSelected = selectedIndex === index;
            
            return (
              <button
                key={p.id_paciente}
                onClick={() => {
                  onPick(p);
                  setOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar más pequeño */}
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(p.nombre_paciente, p.apellido_paciente)}
                  </div>

                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-base truncate">
                        {p.apellido_paciente} {p.nombre_paciente}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Información adicional compacta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>DNI: {p.dni ?? "—"}</span>
                      {p.telefono_paciente && (
                        <span>{p.telefono_paciente}</span>
                      )}
                      {age !== null && (
                        <span>{age} años</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {results.length > 0 && (
              <span>
                {results.length} {results.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
        
        {/* Ayuda de teclado */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">↑↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd>
              Seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd>
              Cerrar
            </span>
          </div>
        </div>
      </div>
    </ModalContent>
  );
};