import { apiFetch } from "../lib/api";

export const historiaApi = {
  getDiagnosticos: (pacienteId: number) =>
    apiFetch(`/historia/pacientes/${pacienteId}/diagnosticos`),

  getAnotaciones: (pacienteId: number) =>
    apiFetch(`/historia/pacientes/${pacienteId}/anotaciones`),

  getMedicaciones: (pacienteId: number) =>
    apiFetch(`/historia/pacientes/${pacienteId}/medicaciones`),
};
