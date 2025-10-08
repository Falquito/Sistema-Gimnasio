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

// ===== NUEVOS TIPOS PARA FULLCALENDAR =====
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    turno: Turno;
    pacienteNombre: string;
    profesionalNombre: string;
    observacion?: string | null;
    estado: string;
    profesionalId: number;
  };
}

export interface ProfessionalStats {
  turnosHoy: number;
  turnosSemana: number;
  turnosMes: number;
  pacientesUnicos: number;
  turnosCompletados: number;
  turnosCancelados: number;
  turnosPendientes: number;
  proximosTurnos: Turno[];
}

export interface CalendarQuery extends AgendaQuery {
  // Heredamos de AgendaQuery y agregamos específicos para calendario
  view?: 'month' | 'week' | 'day';
  incluirCancelados?: boolean;
}

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

// ===== UTILIDADES PARA FULLCALENDAR =====
export class CalendarUtils {
  // Colores por profesional
  private static PROFESSIONAL_COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F59E0B'
  ];

  // Convierte turnos a eventos de FullCalendar
  static turnosToCalendarEvents(turnos: Turno[], duracionMin: number = 30): CalendarEvent[] {
    return turnos.map(turno => {
      const startDateTime = `${turno.fecha}T${turno.horaInicio}`;
      const endDateTime = this.calculateEndTime(turno.fecha, turno.horaInicio, duracionMin);
      
      return {
        id: turno.idTurno.toString(),
        title: turno.idCliente 
          ? `${turno.idCliente.nombre} ${turno.idCliente.apellido}`
          : 'Sin paciente',
        start: startDateTime,
        end: endDateTime,
        backgroundColor: this.getStatusColor(turno.estado),
        borderColor: this.getStatusColor(turno.estado),
        textColor: '#FFFFFF',
        extendedProps: {
          turno: turno,
          pacienteNombre: turno.idCliente 
            ? `${turno.idCliente.nombre} ${turno.idCliente.apellido}`
            : 'Sin paciente',
          profesionalNombre: turno.idProfesional
            ? `${turno.idProfesional.nombre} ${turno.idProfesional.apellido}`
            : 'Sin profesional',
          observacion: turno.observacion,
          estado: turno.estado,
          profesionalId: turno.idProfesional?.id || 0
        }
      };
    });
  }

  // Calcula hora de fin basada en duración
  private static calculateEndTime(fecha: string, horaInicio: string, duracionMin: number): string {
    const startDate = new Date(`${fecha}T${horaInicio}`);
    const endDate = new Date(startDate.getTime() + (duracionMin * 60 * 1000));
    return endDate.toISOString().slice(0, 19); // formato: YYYY-MM-DDTHH:mm:ss
  }

  // Colores por estado
  private static getStatusColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmado':
      case 'pendiente': return '#10B981'; // Verde
      case 'cancelado': return '#EF4444';  // Rojo
      case 'completado': return '#6B7280'; // Gris
      case 'reprogramado': return '#F59E0B'; // Amarillo
      default: return '#3B82F6';           // Azul default
    }
  }

  // Asigna color por profesional
  static getProfessionalColor(professionalId: number): string {
    return this.PROFESSIONAL_COLORS[professionalId % this.PROFESSIONAL_COLORS.length];
  }

  // Calcula estadísticas para dashboard
  static calculateStats(turnos: Turno[]): Partial<ProfessionalStats> {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const monthStart = new Date();
    monthStart.setDate(1);

    const turnosHoy = turnos.filter(t => t.fecha === today).length;
    const turnosSemana = turnos.filter(t => {
      const turnoDate = new Date(t.fecha);
      return turnoDate >= weekStart && turnoDate <= weekEnd;
    }).length;
    
    const turnosMes = turnos.filter(t => {
      const turnoDate = new Date(t.fecha);
      return turnoDate >= monthStart;
    }).length;

    const pacientesUnicos = new Set(
      turnos
        .filter(t => t.idCliente)
        .map(t => t.idCliente!.id)
    ).size;

    const turnosCompletados = turnos.filter(t => t.estado === 'COMPLETADO').length;
    const turnosCancelados = turnos.filter(t => t.estado === 'CANCELADO').length;
    const turnosPendientes = turnos.filter(t => 
      t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO'
    ).length;

    // Próximos turnos (siguientes 7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const proximosTurnos = turnos
      .filter(t => {
        const turnoDate = new Date(t.fecha);
        return turnoDate >= new Date(today) && turnoDate <= nextWeek && 
               (t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO');
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.horaInicio}`);
        const dateB = new Date(`${b.fecha}T${b.horaInicio}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);

    return {
      turnosHoy,
      turnosSemana,
      turnosMes,
      pacientesUnicos,
      turnosCompletados,
      turnosCancelados,
      turnosPendientes,
      proximosTurnos
    };
  }
}

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

  // ===== NUEVOS MÉTODOS PARA FULLCALENDAR =====

  /**
   * Obtiene turnos para el calendario del profesional
   * Específicamente diseñado para FullCalendar
   */
  async getCalendarEvents(query: CalendarQuery): Promise<CalendarEvent[]> {
    console.log('getCalendarEvents called with:', query);
    
    // Preparar query para agenda
    const agendaQuery: AgendaQuery = {
      profesionalId: query.profesionalId,
      desde: query.desde,
      hasta: query.hasta,
        ...(query.estado ? { estado: query.estado } : {})
    };

    try {
      const turnos = await this.getAgenda(agendaQuery);
      console.log('Turnos obtenidos para calendar:', turnos.length);
      
      // Filtrar cancelados si no se incluyen explícitamente
      const turnosFiltrados = query.incluirCancelados 
        ? turnos 
        : turnos.filter(t => t.estado !== 'CANCELADO');

      return CalendarUtils.turnosToCalendarEvents(turnosFiltrados);
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  /**
   * Obtiene turnos específicos del profesional para su dashboard
   */
  async getMisTurnos(profesionalId: number, query?: Partial<CalendarQuery>): Promise<Turno[]> {
    const agendaQuery: AgendaQuery = {
      profesionalId,
      desde: query?.desde,
      hasta: query?.hasta,
      estado: query?.estado
    };

    const turnos = await this.getAgenda(agendaQuery);
    
    // Filtrar solo turnos no cancelados por defecto
    return query?.incluirCancelados 
      ? turnos 
      : turnos.filter(t => t.estado !== 'CANCELADO');
  }

  /**
   * Obtiene estadísticas completas para el dashboard del profesional
   */
  async getProfessionalStats(profesionalId: number): Promise<ProfessionalStats> {
    try {
      // Obtener turnos de los últimos 3 meses para calcular estadísticas
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const turnos = await this.getMisTurnos(profesionalId, {
        desde: threeMonthsAgo.toISOString().split('T')[0],
        incluirCancelados: true // Incluimos para calcular estadísticas completas
      });

      const baseStats = CalendarUtils.calculateStats(turnos);
      
      return {
        turnosHoy: baseStats.turnosHoy || 0,
        turnosSemana: baseStats.turnosSemana || 0,
        turnosMes: baseStats.turnosMes || 0,
        pacientesUnicos: baseStats.pacientesUnicos || 0,
        turnosCompletados: baseStats.turnosCompletados || 0,
        turnosCancelados: baseStats.turnosCancelados || 0,
        turnosPendientes: baseStats.turnosPendientes || 0,
        proximosTurnos: baseStats.proximosTurnos || []
      };
    } catch (error) {
      console.error('Error getting professional stats:', error);
      // Retornar estadísticas vacías en caso de error
      return {
        turnosHoy: 0,
        turnosSemana: 0,
        turnosMes: 0,
        pacientesUnicos: 0,
        turnosCompletados: 0,
        turnosCancelados: 0,
        turnosPendientes: 0,
        proximosTurnos: []
      };
    }
  }

  /**
   * Obtiene los próximos turnos del profesional (para widgets/notificaciones)
   */
  async getProximosTurnos(profesionalId: number, dias: number = 7): Promise<Turno[]> {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + dias);
    
    const turnos = await this.getMisTurnos(profesionalId, {
      desde: today,
      hasta: futureDate.toISOString().split('T')[0],
      estado: 'PENDIENTE'
    });

    return turnos
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.horaInicio}`);
        const dateB = new Date(`${b.fecha}T${b.horaInicio}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }

  // ===== MÉTODOS EXISTENTES =====

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
  
  async completarTurno(id: number): Promise<Turno> {
    const apiResp = await apiFetch<ApiTurno>(`${this.base}/${id}/completar`, {
      method: "PATCH"
    });
    return adaptTurno(apiResp);
  }
   async getWorkingHours(profesionalId: number): Promise<{ start: string; end: string }> {
    return apiFetch<{ start: string; end: string }>(`${this.base}/working-hours?profesionalId=${profesionalId}`);
  }

  
}

export const turnosApi = new TurnosApiService();