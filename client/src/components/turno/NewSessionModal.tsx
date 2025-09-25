// components/NewSessionModal.tsx
"use client";
import React, { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import {
  Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter, useModal,
} from "../ui/animated-modal";

import AppointmentCalendar, {
  type AppointmentCalendarOnConfirm,
} from "../../components/AppointmentCalendar";

import { PatientSelect } from "../patients/PatientPicker";
import { ProfessionalSelect } from "../ProfessionalSelect";
import type { ProfesionalListItem } from "../../services/profesionales.services";
import { turnosApi } from "../../services/turnos.services";

/* ------------------------------ HELPERS (TOP) ------------------------------ */
const pad = (n: number) => n.toString().padStart(2, "0");

const normalizeHHmm = (t?: string) => {
  if (!t) return "";
  const [h = "00", m = "00"] = t.split(":");
  return `${pad(+h)}:${pad(+m)}`;
};

const toMin = (t: string) => {
  const [h, m] = normalizeHHmm(t).split(":").map(Number);
  return h * 60 + m;
};

const addMin = (hhmm: string, minutes: number) => {
  const total = toMin(hhmm) + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
};

const overlap = (aS: string, aE: string, bS: string, bE: string) =>
  toMin(aS) < toMin(bE) && toMin(aE) > toMin(bS);
/* -------------------------------------------------------------------------- */

export interface NewSessionFormData {
  clienteId: number;
  servicioId: number;
  profesionalId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  rutina?: string;
}

interface Props {
  onSubmit: (data: NewSessionFormData) => Promise<void>;
  triggerLabel?: string;
}

export const NewSessionModal: React.FC<Props> = ({ onSubmit, triggerLabel = "Nueva sesión" }) => {
  const [formData, setFormData] = useState<Partial<NewSessionFormData>>({
    fecha: "", horaInicio: "", horaFin: "", rutina: "",
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

const SESSION_MIN = 60; // o 30 si corresponde


const loadBusyForDay = async ({
  profesionalId,
  dateISO,
}: {
  profesionalId: number;
  dateISO: string; // "YYYY-MM-DD"
}) => {
  try {
    const busySlots = await turnosApi.getBusySlotsByDay({
      profesionalId,
      fecha: dateISO,
      durationMin: SESSION_MIN,
      estado: "PENDIENTE" 
    });

    console.log(`Horarios ocupados para profesional ${profesionalId} el ${dateISO}:`, busySlots);
    
    return busySlots;
  } catch (error) {
    console.error('Error cargando horarios ocupados:', error);
    return [];
  }
};
const InnerForm: React.FC<InnerFormProps> = ({
  formData, setFormData, loading, setLoading, onSubmit,
}) => {
  const { setOpen } = useModal();
  const [profesionalSel, setProfesionalSel] = useState<ProfesionalListItem | null>(null);

  const handleInputChange = (field: keyof NewSessionFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cache de agenda por día → { 'YYYY-MM-DD': [{inicio, fin}, ...] }
  const [busyByDate, setBusyByDate] = useState<Record<string, { inicio: string; fin: string }[]>>({});

  const fetchBusyForDay = async (dateISO: string) => {
    if (!formData.profesionalId) return;
    const items = await turnosApi.getAgendaDia({ profesionalId: formData.profesionalId, fecha: dateISO });
    setBusyByDate((prev) => ({
      ...prev,
      [dateISO]: items.map((t) => ({
        inicio: (t.horaInicio || "").slice(0, 5),
        fin: (t.horaFin || addMin((t.horaInicio || "").slice(0, 5), SESSION_MIN)).slice(0, 5),
      })),
    }));
  };

  const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
    aStart < bEnd && aEnd > bStart;

  const isSlotDisabled = (dateISO: string, start24: string, end24: string) => {
    const items = busyByDate[dateISO] || [];
    return items.some((b) => overlap(start24, end24, b.inicio, b.fin));
  };

  const handleCalendarConfirm: AppointmentCalendarOnConfirm = async ({ dateISO, time24, endTime24 }) => {
    if (formData.profesionalId) {
      if (!busyByDate[dateISO]) {
        await fetchBusyForDay(dateISO);
      }
      const items = busyByDate[dateISO] || [];
      if (items.some((b) => overlap(time24, endTime24, b.inicio, b.fin))) {
        alert("Ese horario ya está ocupado. Elegí otro, por favor.");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      fecha: dateISO,
      horaInicio: time24,
      horaFin: endTime24,
    }));
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
    )
      return;

    setLoading(true);
    try {
      await onSubmit(formData as NewSessionFormData);
      setFormData({ fecha: "", horaInicio: "", horaFin: "", rutina: "" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const fechaPreview = formData.fecha
    ? new Date(formData.fecha + "T00:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
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
            <PatientSelect
              value={formData.clienteId ?? null}
              onChange={(id) => setFormData((prev) => ({ ...prev, clienteId: id }))}
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
          <div className="md:col-span-2">
            <ProfessionalSelect
              value={formData.profesionalId ?? null}
              onChange={(id) => {
                setFormData((prev) => ({
                  ...prev,
                  profesionalId: id || undefined,
                  fecha: "",
                  horaInicio: "",
                  horaFin: "",
                }));
                setBusyByDate({});
              }}
              onSelect={(p) => setProfesionalSel(p)}
            />
            {profesionalSel?.servicio && (
              <p className="mt-2 text-sm text-gray-600">
                Especialidad:
                <span className="inline-flex ml-2 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                  {profesionalSel.servicio}
                </span>
              </p>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-2">Fecha y hora *</label>
            <div className="flex items-center gap-3">
              <DateTimePickerButton
                profesionalId={formData.profesionalId ?? undefined}
                onConfirm={handleCalendarConfirm}
                durationMin={SESSION_MIN}
                onDateChange={(dateISO) => {
                  if (!busyByDate[dateISO]) fetchBusyForDay(dateISO);
                }}
                isSlotDisabled={isSlotDisabled}
              />

              {formData.fecha && formData.horaInicio ? (
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-sm">
                  <div className="text-black capitalize">{fechaPreview}</div>
                  <div className="text-gray-600">
                    {formData.horaInicio} – {formData.horaFin}
                  </div>
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

// === Trigger del calendario (bloquea visualmente si no hay profesional)
const DateTimePickerButton = ({
  onConfirm,
  durationMin = 30,
  profesionalId,
  onDateChange,
  isSlotDisabled,
}: {
  onConfirm: AppointmentCalendarOnConfirm;
  durationMin?: number;
  profesionalId?: number;
  onDateChange?: (dateISO: string) => void;
  isSlotDisabled?: (dateISO: string, start24: string, end24: string) => boolean;
}) => {
  const disabled = !profesionalId;
  return (
    <Modal>
      <ModalTrigger
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
            : "bg-white hover:bg-gray-100 text-black border-gray-300"
        }`}
      >
        <CalendarIcon className="w-4 h-4" />
        <p>Elegir fecha y hora</p>
      </ModalTrigger>

      {/* DateTimePickerButton */}
      <ModalBody className="md:max-w-[840px] bg-white border-0 md:rounded-2xl">
        <InnerCalendar
          onConfirm={onConfirm}
          durationMin={durationMin}
          profesionalId={profesionalId}
          onDateChange={onDateChange}
          isSlotDisabled={isSlotDisabled}
          loadBusy={loadBusyForDay}
        />
      </ModalBody>
    </Modal>
  );
};

const InnerCalendar = ({
  onConfirm,
  durationMin,
  profesionalId,
  onDateChange,
  isSlotDisabled,
  loadBusy,
}: {
  onConfirm: AppointmentCalendarOnConfirm;
  durationMin: number;
  profesionalId?: number;
  onDateChange?: (dateISO: string) => void;
  isSlotDisabled?: (dateISO: string, start24: string, end24: string) => boolean;
  loadBusy?: (args: { profesionalId: number; dateISO: string }) => Promise<{ inicio: string; fin: string }[]>;
}) => {
  const { setOpen } = useModal();
  return (
    <div className="p-0">
      <AppointmentCalendar
        durationMin={durationMin}
        onDateChange={onDateChange}
        isSlotDisabled={isSlotDisabled}
        onConfirm={(payload) => {
          onConfirm(payload);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        profesionalId={profesionalId}
        loadBusy={loadBusy}
      />
    </div>
  );
};
