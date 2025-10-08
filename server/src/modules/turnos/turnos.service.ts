import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Turnos } from 'src/entities/entities/Turnos.entity';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';

import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ReprogramarTurnoDto } from './dto/reprogramar-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
import { AgendaQuery } from './dto/agenda.query';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';


@Injectable()
export class TurnosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Turnos) private readonly turnoRepo: Repository<Turnos>,
    @InjectRepository(Profesionales) private readonly profRepo: Repository<Profesionales>,
  ) { }


  async getWorkingHours(profesionalId: number) {
    const prof = await this.profRepo.findOne({ where: { idProfesionales: profesionalId }});
    if (!prof) throw new NotFoundException('Profesional no encontrado');
    return {
      start: this.normHM(prof.hora_inicio_laboral ?? '09:00'),
      end: this.normHM(prof.hora_fin_laboral ?? '21:00'),
    };
  }

  // ====== UTIL ======

  private async getDuracionMin(servicioId: number, fallback?: number): Promise<number> {
    // const servicio = await this.servRepo.findOne({ where: { idServicio: servicioId } });
    // if (!servicio) throw new NotFoundException('Servicio no encontrado');
    // @ts-ignore
    const duracion = 30;
    if (!duracion) {
      throw new UnprocessableEntityException('No se conoce la duración del servicio');
    }
    return Number(duracion);
  }

  /** Acepta 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss' y devuelve 'YYYY-MM-DD' */
  private onlyDate(v?: string): string | undefined {
    if (!v) return undefined;
    return v.length >= 10 ? v.slice(0, 10) : v;
  }

  /** "9:0" -> "09:00" */
  private normHM(hm: string) {
    const [hStr, mStr = '0'] = hm.split(':');
    const h = Number(hStr);
    const m = Number(mStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}`;
  }

  /** "HH:mm" -> minutos (entero) */
  private toMin(hm: string) {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  }

  /** "2025-09-25T14:00:00-03:00" -> { fecha: "2025-09-25", hora: "14:00" } */
  private isoToParts(iso: string) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return { fecha: `${y}-${m}-${day}`, hora: `${hh}:${mm}` };
  }

  /** "14:00" + 30 -> "14:30" */
  private addMinutesHM(hora: string, min: number) {
    const [hh, mm] = hora.split(':').map(Number);
    const base = new Date(0, 0, 1, hh, mm, 0, 0);
    base.setMinutes(base.getMinutes() + min);
    const H = String(base.getHours()).padStart(2, '0');
    const M = String(base.getMinutes()).padStart(2, '0');
    return `${H}:${M}`;
  }

  /** Trae el turno por id o lanza 404 */
  private async getTurnoOrThrow(id: number) {
    const turno = await this.turnoRepo.findOne({
      where: { idTurno: id },
      relations: ['idProfesional'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return turno;
  }

  private getProfesionalId(turno: Turnos): number {
    return (turno.idProfesional as any)?.idProfesionales ?? (turno as any).idProfesional;
  }

  // ====== HU-4: DISPONIBILIDAD ======
  async disponibilidad(q: DisponibilidadQuery) {
    const duracionMin = await this.getDuracionMin(q.servicioId, q.duracionMin);

    if (!q.fecha) {
      throw new UnprocessableEntityException('Para este modelo usá ?fecha=YYYY-MM-DD');
    }

    // profesionales candidatos
    let profesionalesIds: number[] = [];
    if (q.profesionalId) {
      profesionalesIds = [q.profesionalId];
    }

    // (lógica de slots ocupados/commentado)
  }




  // ====== HU-5: CREAR ======
  async crear(dto: CrearTurnoDto) {
  const { fecha, hora: horaInicio } = this.isoToParts(dto.inicio);
  const queryRunner = this.dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { pacienteId, observacion, profesionalId, recepcionistaId } = dto;

    const profesional = await queryRunner.manager.findOneBy(Profesionales, { idProfesionales: profesionalId });
    const recepcionista = await queryRunner.manager.findOneBy(Recepcionista, { idRecepcionista: recepcionistaId });
    const paciente = await queryRunner.manager.findOneBy(Paciente, { id_paciente: pacienteId });

    if (!profesional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    // 1) duración (fija por ahora o tomada del servicio)
    const DURACION_MIN = 60; // o await this.getDuracionMin(dto.servicioId, 60);

    // 2) normalizar inicio y calcular fin del NUEVO turno
    const hInicioNorm = this.normHM(horaInicio);
    const hFinNorm = this.addMinutesHM(hInicioNorm, DURACION_MIN);

    // 2.a) obtener jornada laboral del profesional
    const jornadaIni = this.normHM(profesional.hora_inicio_laboral ?? '09:00');
    const jornadaFin = this.normHM(profesional.hora_fin_laboral ?? '21:00');

    // 2.b) validar que el nuevo turno esté dentro de la jornada laboral
    if (this.toMin(hInicioNorm) < this.toMin(jornadaIni) || this.toMin(hFinNorm) > this.toMin(jornadaFin)) {
      throw new UnprocessableEntityException(
        `El horario (${hInicioNorm}-${hFinNorm}) está fuera de la jornada laboral del profesional (${jornadaIni}-${jornadaFin}).`
      );
    }

    // 3) traer turnos del mismo día/profesional (no cancelados)
    const existentes = await queryRunner.manager
      .getRepository(Turnos)
      .createQueryBuilder('t')
      .where('t.id_profesional = :pid', { pid: profesionalId })
      .andWhere('t.fecha = :f', { f: fecha })
      .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
      .getMany();

    // 4) chequeo de solape en minutos (no strings)
    const bStart = this.toMin(hInicioNorm);
    const bEnd = this.toMin(hFinNorm);

    const seSolapa = existentes.some((t) => {
      const ini = this.normHM(t.horaInicio);
      const fin = (t as any).horaFin ? this.normHM((t as any).horaFin) : this.addMinutesHM(ini, DURACION_MIN);
      const aStart = this.toMin(ini);
      const aEnd = this.toMin(fin);
      return aStart < bEnd && aEnd > bStart; // overlap
    });

    if (seSolapa) {
      throw new ConflictException('El horario ya está ocupado');
    }

    // 5) crear y guardar (guardar hora normalizada)
    const turno = queryRunner.manager.create(Turnos, {
      idRecepcionista: recepcionista!,
      idPaciente: paciente!,
      idProfesional: profesional!,
      estado: 'PENDIENTE',
      observacion,
      fecha,
      horaInicio: hInicioNorm, // "HH:mm" consistente
      // horaFin: hFinNorm,     // si agregás la columna
      fechaAlta: fecha,
      fechaUltUpd: '-',
    });

    await queryRunner.manager.save(turno);
    await queryRunner.commitTransaction();
    return turno;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (error instanceof ConflictException || error instanceof UnprocessableEntityException) throw error;
    throw new InternalServerErrorException(error);
  } finally {
    await queryRunner.release();
  }
}



  // ====== HU-6a: CANCELAR ======
  async cancelar(id: number, dto: CancelarTurnoDto) {
    const turno = await this.getTurnoOrThrow(id);
    if (turno.estado === 'CANCELADO') return turno;
    turno.estado = 'CANCELADO';
    return await this.turnoRepo.save(turno);
  }

  async completar(id: number) {
    const turno = await this.getTurnoOrThrow(id);

    if (turno.estado === 'COMPLETADO') {
      return turno; // Ya está completado
    }

    if (turno.estado === 'CANCELADO') {
      throw new ConflictException('No se puede completar un turno cancelado');
    }

    turno.estado = 'COMPLETADO';
    turno.fechaUltUpd = new Date().toISOString().slice(0, 10); // Fecha actual

    return await this.turnoRepo.save(turno);
  }

  async agenda(q: { profesionalId?: number; desde?: string; hasta?: string; estado?: string }) {
    const qb = this.turnoRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.idPaciente', 'paciente')
      .leftJoinAndSelect('t.idProfesional', 'profesional')
      .leftJoinAndSelect('t.idRecepcionista', 'recep');

    if (q.profesionalId != null) {
      qb.andWhere('t.id_profesional = :pid', { pid: q.profesionalId });
    }

    const d = this.onlyDate(q.desde);
    if (d) qb.andWhere('t.fecha >= :d', { d });

    const h = this.onlyDate(q.hasta);
    if (h) qb.andWhere('t.fecha <= :h', { h });

    if (q.estado) {
      qb.andWhere('t.estado = :e', { e: q.estado });
    } else {
      qb.andWhere('t.estado != :cancel', { cancel: 'CANCELADO' });
    }

    qb.orderBy('t.fecha', 'ASC').addOrderBy('t.horaInicio', 'ASC');

    const rows = await qb.getMany();

    console.log(`Agenda query - profesional: ${q.profesionalId}, fecha: ${d}, encontrados: ${rows.length} turnos`);

    return rows;
  }
  async listar(q: { pacienteId?: number; estado?: string }) {
    const qb = this.turnoRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.idPaciente', 'paciente')
      .leftJoinAndSelect('t.idProfesional', 'profesional')
      .leftJoinAndSelect('t.idRecepcionista', 'recep');

    if (q.pacienteId) {
      qb.andWhere('paciente.id_paciente = :pid', { pid: q.pacienteId });
    }
    if (q.estado) {
      qb.andWhere('t.estado = :e', { e: q.estado });
    }

    qb.orderBy('t.fecha', 'ASC').addOrderBy('t.horaInicio', 'ASC');
    return qb.getMany();
  }

  public async getById(id: number) {
    return this.getTurnoOrThrow(id);
  }
  async obtenerEstadisticas(period: '6semanas' | '6meses' | '1año' = '6semanas') {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const ahora = new Date();
      const fechaDesde = new Date(ahora);

      switch (period) {
        case '6semanas':
          fechaDesde.setDate(fechaDesde.getDate() - 42);
          break;
        case '6meses':
          fechaDesde.setMonth(fechaDesde.getMonth() - 6);
          break;
        case '1año':
          fechaDesde.setFullYear(fechaDesde.getFullYear() - 1);
          break;
      }

      const fechaDesdeFmt = fechaDesde.toISOString().slice(0, 10);
      const mesActual = ahora.toISOString().slice(0, 7);
      const FK_PAC = `"idPacienteIdPaciente"`;

      const turnosPorMes = await queryRunner.query(
        `
      WITH meses_serie AS (
        SELECT 
          generate_series(
            date_trunc('month', $1::date),
            date_trunc('month', CURRENT_DATE),
            '1 month'::interval
          )::date AS mes_fecha
      ),
      turnos_agrupados AS (
        SELECT 
          date_trunc('month', to_date(fecha, 'YYYY-MM-DD'))::date AS mes_fecha,
          COUNT(*)::int AS total
        FROM turnos
        WHERE estado != 'CANCELADO'
          AND fecha ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
          AND to_date(fecha, 'YYYY-MM-DD') >= $1
        GROUP BY mes_fecha
      )
      SELECT 
        TO_CHAR(m.mes_fecha, 'TMMonth') AS mes,
        EXTRACT(MONTH FROM m.mes_fecha)::int AS mes_num,
        COALESCE(t.total, 0)::int AS total
      FROM meses_serie m
      LEFT JOIN turnos_agrupados t ON m.mes_fecha = t.mes_fecha
      ORDER BY m.mes_fecha;
      `,
        [fechaDesdeFmt]
      );

      const turnosMesActual = await queryRunner.query(
        `
      SELECT COUNT(*)::int AS total
      FROM turnos
      WHERE estado != 'CANCELADO'
        AND fecha LIKE $1 || '%';
      `,
        [mesActual]
      );

      const turnosPorEstado = await queryRunner.query(`
      SELECT estado, COUNT(*)::int AS total
      FROM turnos
      GROUP BY estado;
    `);

      const turnosPorHora = await queryRunner.query(`
      SELECT hora_inicio AS hora, COUNT(*)::int AS total
      FROM turnos
      WHERE estado != 'CANCELADO'
        AND hora_inicio ~ '^[0-9]{2}:[0-9]{2}$'
      GROUP BY hora_inicio
      ORDER BY hora_inicio;
    `);

      const turnosPorEspecialidad = await queryRunner.query(`
      SELECT 
        COALESCE(p.servicio, 'Sin especialidad')                         AS especialidad,
        COUNT(*)::int                                                    AS total,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2)               AS porcentaje
      FROM turnos t
      LEFT JOIN profesionales p ON t.id_profesional = p.id_profesionales
      WHERE t.estado != 'CANCELADO'
      GROUP BY p.servicio
      ORDER BY total DESC;
    `);

      const pacientesActivosPorMes = await queryRunner.query(
        `
  WITH meses_serie AS (
    SELECT 
      generate_series(
        date_trunc('month', $1::date),
        date_trunc('month', CURRENT_DATE),
        '1 month'::interval
      )::date AS mes_fecha
  ),
  pacientes_por_mes AS (
    SELECT 
      date_trunc('month', to_date(t.fecha, 'YYYY-MM-DD'))::date AS mes_fecha,
      COUNT(DISTINCT t.${FK_PAC})::int AS activos
    FROM turnos t
    WHERE t.estado != 'CANCELADO'
      AND t.fecha ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      AND to_date(t.fecha, 'YYYY-MM-DD') >= $1
    GROUP BY mes_fecha
  )
  SELECT 
    TO_CHAR(m.mes_fecha, 'TMMonth') AS mes,
    EXTRACT(MONTH FROM m.mes_fecha)::int AS mes_num,
    EXTRACT(YEAR FROM m.mes_fecha)::int AS year,
    COALESCE(p.activos, 0)::int AS activos
  FROM meses_serie m
  LEFT JOIN pacientes_por_mes p ON m.mes_fecha = p.mes_fecha
  ORDER BY m.mes_fecha;
  `,
        [fechaDesdeFmt]
      );

      const pacientesPorMes = await queryRunner.query(
        `
  WITH meses_serie AS (
    SELECT 
      generate_series(
        date_trunc('month', $1::date),
        date_trunc('month', CURRENT_DATE),
        '1 month'::interval
      )::date AS mes_fecha
  ),
  primeras AS (
    SELECT
      ${FK_PAC} AS pac_id,
      date_trunc('month', MIN(to_date(fecha,'YYYY-MM-DD')))::date AS primera_mes
    FROM turnos
    WHERE fecha ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      AND estado != 'CANCELADO'  
    GROUP BY ${FK_PAC}
  ),
  nuevos_por_mes AS (
    SELECT
      primera_mes AS mes_fecha,
      COUNT(*)::int AS nuevos
    FROM primeras
    WHERE primera_mes >= $1::date
    GROUP BY primera_mes
  )
  SELECT
    TO_CHAR(m.mes_fecha, 'TMMonth') AS mes,
    EXTRACT(MONTH FROM m.mes_fecha)::int AS mes_num,
    EXTRACT(YEAR FROM m.mes_fecha)::int AS year,
    COALESCE(n.nuevos, 0)::int AS nuevos
  FROM meses_serie m
  LEFT JOIN nuevos_por_mes n ON m.mes_fecha = n.mes_fecha
  ORDER BY m.mes_fecha;
  `,
        [fechaDesdeFmt]
      );

      // Conteos de pacientes (tabla paciente)
      const pacientes = await queryRunner.query(`
      SELECT
        COUNT(*) FILTER (WHERE estado = true)  ::int AS activos,
        COUNT(*) FILTER (WHERE estado = false) ::int AS inactivos,
        COUNT(*)                               ::int AS total
      FROM paciente;
    `);

      // Pacientes NUEVOS de este mes = primer turno cae en este mes
      const pacientesNuevosMesRow = await queryRunner.query(
        `
      WITH primeras AS (
        SELECT
          ${FK_PAC}                                AS pac_id,
          MIN(to_date(fecha,'YYYY-MM-DD'))         AS primera
        FROM turnos
        WHERE fecha ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        GROUP BY ${FK_PAC}
      )
      SELECT COUNT(*)::int AS total
      FROM primeras
      WHERE TO_CHAR(primera, 'YYYY-MM') = $1;
      `,
        [mesActual]
      );

      const horaPico =
        turnosPorHora.length > 0
          ? turnosPorHora.reduce((max: any, curr: any) =>
            Number(curr.total) > Number(max.total) ? curr : max
          )
          : { hora: '16:00', total: 0 };

      const especialidadTop =
        turnosPorEspecialidad.length > 0
          ? turnosPorEspecialidad[0]
          : { especialidad: 'N/A', porcentaje: 0 };

      const totalTurnos = turnosPorMes.reduce(
        (sum: number, m: any) => sum + Number(m.total),
        0
      );
      const promedioMensual =
        turnosPorMes.length > 0 ? Math.round(totalTurnos / turnosPorMes.length) : 0;
      const promedioSemanal = Math.round(promedioMensual / 4.3);

      const mesAnterior = new Date(ahora);
      mesAnterior.setMonth(mesAnterior.getMonth() - 1);
      const fechaMesAnterior = mesAnterior.toISOString().slice(0, 7);

      const turnosMesAnterior = await queryRunner.query(
        `
      SELECT COUNT(*)::int AS total
      FROM turnos
      WHERE estado != 'CANCELADO'
        AND fecha LIKE $1 || '%';
      `,
        [fechaMesAnterior]
      );

      const totalMesActual = Number(turnosMesActual[0]?.total || 0);
      const totalMesAnt = Number(turnosMesAnterior[0]?.total || 0);
      const crecimiento =
        totalMesAnt > 0
          ? Math.round(((totalMesActual - totalMesAnt) / totalMesAnt) * 100)
          : 0;

      const incrementoPacientes = Number(pacientesNuevosMesRow[0]?.total || 0);

      return {
        kpis: {
          totalTurnos: totalMesActual,
          pacientesActivos: {
            cantidad: Number(pacientes[0]?.activos || 0),
            incremento: incrementoPacientes,
          },
          horaPico: {
            hora: horaPico.hora,
            promedio: Number(horaPico.total),
          },
          especialidadTop: {
            nombre: especialidadTop.especialidad,
            porcentaje: Number(especialidadTop.porcentaje),
          },
          servicioPrincipal: {
            nombre: 'Sesión Regular',
            cantidad: 156,
          },
        },
        turnos: {
          porMes: turnosPorMes,
          porEstado: turnosPorEstado,
          porHora: turnosPorHora,
          promedioSemanal,
          promedioMensual,
          crecimiento,
        },
        pacientes: {
          activos: Number(pacientes[0]?.activos || 0),
          inactivos: Number(pacientes[0]?.inactivos || 0),
          total: Number(pacientes[0]?.total || 0),
          porMes: pacientesPorMes,
          activosPorMes: pacientesActivosPorMes,
          nuevosMes: incrementoPacientes,
        },
        especialidades: turnosPorEspecialidad,
        horarios: {
          distribucion: turnosPorHora,
          pico: horaPico.hora,
          tranquilo:
            turnosPorHora.length > 0
              ? turnosPorHora.reduce((min: any, curr: any) =>
                Number(curr.total) < Number(min.total) ? curr : min
              ).hora
              : '13:00',
        },
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
