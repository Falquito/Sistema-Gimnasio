// src/services/pacientes.api.ts
import { apiFetch } from "../lib/api";

export type PacienteListItem = {
 id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  dni: string;
  email: string;
  telefono_paciente: string;
  fecha_nacimiento: string;
  genero: string;
  id_obra_social?: number;
  nro_obra_social?: string;
  observaciones?: string;
  fecha_alta: string;
  fecha_ult_upd: string;
  estado:boolean;
};

const BASE = "/pacientes";

export async function listarPacientes(): Promise<PacienteListItem[]> {
  return await apiFetch<PacienteListItem[]>(BASE);
}

export async function buscarPacientes(q: string): Promise<PacienteListItem[]> {
  const term = (q ?? "").trim();

  if (!term) return listarPacientes();

  const url = `${BASE}?q=${encodeURIComponent(term)}`;
  try {
    const data = await apiFetch<any>(url);
    if (Array.isArray(data)) return data as PacienteListItem[];
  } catch {
  }

  // Fallback: traer todos y filtrar en el cliente
  const all = await listarPacientes();
  const lower = term.toLowerCase();
  return all.filter((p) =>
    [p.nombre_paciente, p.apellido_paciente, p.dni, p.telefono_paciente]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(lower))
  );
}

export async function getPacienteById(id: number): Promise<PacienteListItem> {
  return apiFetch<PacienteListItem>(`${BASE}/${id}`);
}
