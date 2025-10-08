import { apiFetch } from "../lib/api";

export const historiaApi = {
  getDiagnosticos: (pacienteId: number) =>
    apiFetch(`/historia/pacientes/${pacienteId}/diagnosticos`),

  getAnotaciones: async (pacienteId: number) => {
    const data = await apiFetch(`/historia/pacientes/${pacienteId}/anotaciones`);
    console.log("📬 Datos recibidos desde backend (historiaApi):", data);
    return data;
  },

  getMedicaciones: (pacienteId: number) =>
    apiFetch(`/historia/pacientes/${pacienteId}/medicaciones`),
};
