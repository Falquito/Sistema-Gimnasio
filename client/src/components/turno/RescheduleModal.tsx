"use client";

import { type ReactNode, useState } from "react";
import { X } from "lucide-react";
import { turnosApi } from "../../services/turnos.services";
import type { Turno } from "../../types/turnos";
import AppointmentCalendar, { type AppointmentCalendarOnConfirm } from "../AppointmentCalendar";
import { ErrorAlert } from "./ErrorAlert";

interface RescheduleModalProps {
  turno: Turno | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RescheduleModal({ turno, onClose, onSuccess }: RescheduleModalProps): ReactNode {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: AppointmentCalendarOnConfirm = async ({ dateISO, time24 }) => {
    if (!turno) return;

    try {
      setError(null);

      // Check for conflicting appointments
      const busySlots = await turnosApi.getBusySlotsByDay({
        profesionalId: turno.idProfesional?.id || 0,
        fecha: dateISO,
        durationMin: turno.idServicio?.duracionMin || 30
      });

      // Check if the requested time conflicts with any busy slot
      const hasConflict = busySlots.some(slot => {
        // Skip the current appointment being rescheduled
        if (turno.fecha === dateISO && turno.horaInicio === slot.inicio) {
          return false;
        }
        
        // Check if the new time falls within any existing slot
        return time24 >= slot.inicio && time24 < slot.fin;
      });

      if (hasConflict) {
        throw new Error("Ya existe un turno programado para este horario. Por favor seleccione otro horario.");
      }
      
      // Format as ISO8601 without timezone offset to match server expectations
      const nuevoInicio = new Date(`${dateISO}T${time24}`);
      
      await turnosApi.reprogramarTurno(
        turno.idTurno,
        { 
          nuevoInicio: nuevoInicio.toISOString()
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reprogramar el turno");
    }
  };

  if (!turno) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full relative shadow-lg">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Reprogramar Turno</h2>
          
          {error && <ErrorAlert message={error} />}

          <AppointmentCalendar
            profesionalId={turno.idProfesional?.id}
            onConfirm={handleSubmit}
            onClose={onClose}
            durationMin={60} // Forzar intervalos de 60 minutos
            workingHours={{ start: "09:00", end: "18:00" }}
            loadBusy={async ({ profesionalId, dateISO }) => {
              if (!profesionalId) return [];
              return turnosApi.getBusySlotsByDay({
                profesionalId,
                fecha: dateISO,
                durationMin: 60 // Forzar intervalos de 60 minutos
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
