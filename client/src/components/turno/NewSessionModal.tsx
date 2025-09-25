// components/NewSessionModal.tsx
"use client";
import React, { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "../ui/animated-modal";
import  AppointmentCalendar  from "../../components/FullCalendar"; 
import type { AppointmentCalendarOnConfirm } from "../../components/FullCalendar"; 

export interface NewSessionFormData {
  clienteId: number;
  servicioId: number;
  profesionalId: number;
  fecha: string;       // "YYYY-MM-DD"
  horaInicio: string;  // "HH:MM"
  horaFin: string;     // "HH:MM"
  rutina?: string;
}

interface Props {
  onSubmit: (data: NewSessionFormData) => Promise<void>;
  triggerLabel?: string;
}

export const NewSessionModal: React.FC<Props> = ({ onSubmit, triggerLabel = "Nueva sesión" }) => {
  const [formData, setFormData] = useState<Partial<NewSessionFormData>>({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    rutina: "",
  });
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      <ModalTrigger className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-medium transition-all duration-200 border border-green-500/30">
        <span className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {triggerLabel}
        </span>
      </ModalTrigger>

      <ModalBody className="bg-white border-0 md:rounded-2xl md:max-w-[760px]">
        <InnerForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
          onSubmit={onSubmit}
        />
      </ModalBody>
    </Modal>
  );
};

type InnerFormProps = {
  formData: Partial<NewSessionFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<NewSessionFormData>>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: NewSessionFormData) => Promise<void>;
};

const InnerForm: React.FC<InnerFormProps> = ({
  formData,
  setFormData,
  loading,
  setLoading,
  onSubmit,
}) => {
  const { setOpen } = useModal();

  const handleInputChange = (field: keyof NewSessionFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalendarConfirm: AppointmentCalendarOnConfirm = ({ dateISO, time24, endTime24 }) => {
    setFormData((prev) => ({
      ...prev,
      fecha: dateISO,
      horaInicio: time24,
      horaFin: endTime24,
    }));
    // cerrar SOLO el modal del calendario: lo tenemos anidado, así que usamos su propio setOpen en el hijo.
    // Se maneja dentro del DateTimePicker (abajo).
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (
      !formData.clienteId ||
      !formData.servicioId ||
      !formData.profesionalId ||
      !formData.fecha ||
      !formData.horaInicio ||
      !formData.horaFin
    ) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData as NewSessionFormData);
      setFormData({ fecha: "", horaInicio: "", horaFin: "", rutina: "" });
      setOpen(false); // cierra el modal principal
    } catch (err) {
      console.error("Error al crear sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  const fechaPreview = formData.fecha
    ? new Date(formData.fecha + "T00:00:00")
      .toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <ModalContent className="p-6 md:p-8 bg-white">
      {/* Header */} 
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Nueva Sesión de Entrenamiento</h2>
            <p className="text-gray-600 text-sm">Programa una nueva cita</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Paciente *</label>
            <input
              type="number"
              value={formData.clienteId ?? ""}
              onChange={(e) => handleInputChange("clienteId", parseInt(e.target.value))}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400"
              placeholder="ID del cliente"
            />
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Servicio *</label>
            <select
              value={formData.servicioId ?? ""}
              onChange={(e) => handleInputChange("servicioId", parseInt(e.target.value))}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-black"
            >
              <option value="">Seleccionar servicio</option>
              <option value="1">Entrenamiento Personal</option>
              <option value="2">Clase Grupal</option>
              <option value="3">Consulta Nutricional</option>
            </select>
          </div>

          {/* Profesional */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Profesional *</label>
            <select
              value={formData.profesionalId ?? ""}
              onChange={(e) => handleInputChange("profesionalId", parseInt(e.target.value))}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-black"
            >
              <option value="">Seleccionar profesional</option>
              <option value="1">Carlos Rodríguez</option>
              <option value="2">María González</option>
              <option value="3">Juan Pérez</option>
            </select>
          </div>

          {/* Fecha y hora -> botón que abre el calendario */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-2">Fecha y hora *</label>
            <div className="flex items-center gap-3">
              <DateTimePickerButton
                onConfirm={handleCalendarConfirm}
                durationMin={30} // ajustá según el servicio
              />

              {/* Preview elegido */}
              {formData.fecha && formData.horaInicio ? (
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-sm">
                  <div className="text-black capitalize">{fechaPreview}</div>
                  <div className="text-gray-600">{formData.horaInicio} – {formData.horaFin}</div>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Sin seleccionar</span>
              )}
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Rutina/Observaciones</label>
          <textarea
            rows={4}
            value={formData.rutina ?? ""}
            onChange={(e) => handleInputChange("rutina", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 resize-none"
            placeholder="Detalles de la rutina o notas adicionales..."
          />
        </div>

        <ModalFooter className="border-t border-gray-200 bg-white pt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="px-6 py-2.5 bg-white hover:bg-gray-100 text-black border border-gray-300 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Programar Sesión"}
          </button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

// Botón que abre un modal ANIDADO con el calendario (con las mismas animaciones)
const DateTimePickerButton = ({
  onConfirm,
  durationMin = 30,
}: {
  onConfirm: AppointmentCalendarOnConfirm;
  durationMin?: number;
}) => {
  return (
    <Modal >
      <ModalTrigger className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 rounded-xl border border-gray-300 text-black">
        <CalendarIcon className="w-4 h-4 text-black" />
        <p className="text-black">Elegir fecha y hora</p>
        
      </ModalTrigger>

      <ModalBody className="md:max-w-[840px] bg-white border-0 md:rounded-2xl">
        <InnerCalendar onConfirm={onConfirm} durationMin={durationMin} />
      </ModalBody>
    </Modal>
  );
};

// Separamos para poder usar useModal dentro del modal anidado
const InnerCalendar = ({
  onConfirm,
  durationMin,
}: {
  onConfirm: AppointmentCalendarOnConfirm;
  durationMin: number;
}) => {
  const { setOpen } = useModal();
  return (
    <div className="p-0">
      <AppointmentCalendar
        durationMin={durationMin}
        onConfirm={(payload) => {
          onConfirm(payload);
          setOpen(false); // cerrar SOLO el modal del calendario
        }}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};