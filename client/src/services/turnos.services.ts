// src/services/turnos.services.ts
import type {
  DisponibilidadQuery,
  DisponibilidadResponse,
  CrearTurnoRequest,
  Turno,
  AgendaQuery,
  CancelarTurnoRequest,
  ReprogramarTurnoRequest,
} from "../types/turnos";
import { apiFetch } from "../lib/api";

type ApiPaciente = {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  telefono_paciente: string;
  dni: string;
  genero: string | null;
  fecha_nacimiento: string;
  observaciones: string | null;
} | null;

type ApiProfesional = {
  idProfesionales: number;
  nombreProfesional: string;
  apellidoProfesional: string;
  email: string | null;
  telefono: string | null;
  dni: string | null;
  genero: string | null;
  fechaAlta: string | null;
  fechaUltUpd: string | null;
  servicio?: string | null;
} | null;

type ApiRecepcionista = {
  idRecepcionista: number;
  nombreRecepcionista: string;
  apellidoRecepcionista: string;
  telefonoRecepcionista: string | null;
  dni: string | null;
  fechaAlta: string | null;
  fechaUltUpd: string | null;
} | null;

type ApiTurno = {
  idTurno: number;
  fecha: string;         // "YYYY-MM-DD"
  horaInicio: string;    // "HH:mm"  (o "HH:mm:ss")
  horaFin?: string | null;
  observacion: string | null;
  estado: string;
  fechaAlta: string | null;
  fechaUltUpd: string | null;
  idPaciente: ApiPaciente;
  idProfesional: ApiProfesional;
  idRecepcionista: ApiRecepcionista;
};

/** ==== Adaptador: ApiTurno -> Turno del front ==== */
function adaptTurno(t: ApiTurno): Turno {
  const hhmm = (v?: string | null) => (v ? v.slice(0, 5) : null);

  return {
    idTurno: t.idTurno,
    fecha: t.fecha,
    horaInicio: hhmm(t.horaInicio) ?? t.horaInicio, // normalizo a HH:mm
    horaFin: hhmm(t.horaFin),
    observacion: t.observacion ?? null,
    estado: t.estado as Turno["estado"],
    fechaAlta: t.fechaAlta,
    fechaUltUpd: t.fechaUltUpd,
    idCliente: t.idPaciente
      ? {
          id: t.idPaciente.id_paciente,
          nombre: t.idPaciente.nombre_paciente,
          apellido: t.idPaciente.apellido_paciente,
          telefono: t.idPaciente.telefono_paciente,
          dni: t.idPaciente.dni,
          genero: t.idPaciente.genero,
          fechaNacimiento: t.idPaciente.fecha_nacimiento,
          observaciones: t.idPaciente.observaciones,
        }
      : null,
    idProfesional: t.idProfesional
      ? {
          id: t.idProfesional.idProfesionales,
          nombre: t.idProfesional.nombreProfesional,
          apellido: t.idProfesional.apellidoProfesional,
          email: t.idProfesional.email ?? null,
          telefono: t.idProfesional.telefono ?? null,
          dni: t.idProfesional.dni ?? null,
          genero: t.idProfesional.genero ?? null,
          fechaAlta: t.idProfesional.fechaAlta ?? null,
          fechaUltUpd: t.idProfesional.fechaUltUpd ?? null,
          servicio: t.idProfesional.servicio ?? null,
        }
      : null,
    idRecepcionista: t.idRecepcionista
      ? {
          id: t.idRecepcionista.idRecepcionista,
          nombre: t.idRecepcionista.nombreRecepcionista,
          apellido: t.idRecepcionista.apellidoRecepcionista,
          telefono: t.idRecepcionista.telefonoRecepcionista ?? null,
          dni: t.idRecepcionista.dni ?? null,
          fechaAlta: t.idRecepcionista.fechaAlta ?? null,
          fechaUltUpd: t.idRecepcionista.fechaUltUpd ?? null,
        }
      : null,
  };
}

/** Para el calendario */
export type BusySlot = { inicio: string; fin: string };
const addMin = (hhmm: string, min: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + min;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}`;
};

export class TurnosApiService {
  private base = "/turnos";

  // GET /turnos/disponibles
  async getDisponibilidad(query: DisponibilidadQuery): Promise<DisponibilidadResponse> {
    const params = new URLSearchParams();
    params.append("servicioId", String(query.servicioId));
    if (query.profesionalId != null) params.append("profesionalId", String(query.profesionalId));
    if (query.fecha) params.append("fecha", query.fecha);
    if (query.desde) params.append("desde", query.desde);
    if (query.hasta) params.append("hasta", query.hasta);
    if (query.duracionMin) params.append("duracionMin", String(query.duracionMin));
    return apiFetch<DisponibilidadResponse>(`${this.base}/disponibles?${params.toString()}`);
  }

  // POST /turnos
  async crearTurno(data: CrearTurnoRequest): Promise<Turno> {
    const apiResp = await apiFetch<ApiTurno>(this.base, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return adaptTurno(apiResp);
  }

  // GET /turnos/agenda  (parámetros opcionales; no mandamos "undefined")
  async getAgenda(query: AgendaQuery): Promise<Turno[]> {
    const params = new URLSearchParams();
    if (query.profesionalId != null) params.append("profesionalId", String(query.profesionalId));
    if (query.desde) params.append("desde", query.desde);
    if (query.hasta) params.append("hasta", query.hasta); // si tu backend lo ignora, no pasa nada
    if (query.estado) params.append("estado", query.estado);
    const apiResp = await apiFetch<ApiTurno[]>(`${this.base}/agenda?${params.toString()}`);
    return apiResp.map(adaptTurno);
  }

  /** Conveniencia: agenda de UN DÍA para un profesional.
   *  Usa /turnos/agenda con profesionalId + estado + desde,
   *  y filtra a la fecha exacta en el front 
   */
 async getAgendaDia(args: { profesionalId: number; fecha: string; estado?: string }): Promise<Turno[]> {
  const { profesionalId, fecha, estado = "PENDIENTE" } = args;

  // arma rango completo del día en ISO
  const desde = fecha;
  const hasta = `${fecha}T23:59:59`;

  const rows = await this.getAgenda({ profesionalId, desde, hasta, estado });

  // si tu backend ignora "hasta", no pasa nada; filtramos por fecha acá
  return rows.filter((t) => t.fecha === fecha && t.estado !== "CANCELADO");
}

  /** Devuelve los slots ocupados {inicio, fin} de ese día.
   *  Si el backend no trae horaFin, la calculo con durationMin.
   */
 async getBusySlotsByDay(args: {
  profesionalId: number;
  fecha: string;           // YYYY-MM-DD
  durationMin?: number;    // por defecto 60
  estado?: string;         // por defecto "PENDIENTE"
}): Promise<BusySlot[]> {
  const { profesionalId, fecha, durationMin = 60, estado } = args;
  
  // Llamar a agenda en lugar de getAgendaDia para tener más control
  const rows = await this.getAgenda({ 
    profesionalId, 
    desde: fecha, 
    hasta: fecha, // mismo día
    estado 
  });
  
  console.log(`getBusySlotsByDay - profesional: ${profesionalId}, fecha: ${fecha}, turnos encontrados:`, rows.length);
  
  const busySlots = rows
    .filter((t) => t.fecha === fecha && t.estado !== "CANCELADO") // doble filtro por seguridad
    .map((t) => {
      const inicio = (t.horaInicio || "").slice(0, 5); // aseguro HH:mm
      const fin = t.horaFin ?? addMin(inicio, durationMin);
      console.log(`Turno ocupado: ${inicio} - ${fin.slice(0, 5)}`);
      return { inicio, fin: fin.slice(0, 5) }; // asegurar HH:mm también en fin
    });
    
  console.log(`Slots ocupados finales:`, busySlots);
  return busySlots;
}

  // GET /turnos
  async listarTurnos(clienteId?: number, estado?: string): Promise<Turno[]> {
    const params = new URLSearchParams();
    if (clienteId != null) params.append("pacienteId", String(clienteId));
    if (estado && estado.toLowerCase() !== "todos") params.append("estado", estado);
    const apiResp = await apiFetch<ApiTurno[]>(`${this.base}${params.toString() ? `?${params.toString()}` : ""}`);
    return apiResp.map(adaptTurno);
  }

  // GET /turnos/:id
  async getTurnoById(id: number): Promise<Turno> {
    const apiResp = await apiFetch<ApiTurno>(`${this.base}/${id}`);
    return adaptTurno(apiResp);
  }

  // PATCH /turnos/:id/cancelar
  async cancelarTurno(id: number, data: CancelarTurnoRequest): Promise<Turno> {
    const apiResp = await apiFetch<ApiTurno>(`${this.base}/${id}/cancelar`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return adaptTurno(apiResp);
  }

  // PATCH /turnos/:id/reprogramar
  async reprogramarTurno(id: number, data: ReprogramarTurnoRequest): Promise<Turno> {
    const apiResp = await apiFetch<ApiTurno>(`${this.base}/${id}/reprogramar`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return adaptTurno(apiResp);
  }
}

export const turnosApi = new TurnosApiService();
