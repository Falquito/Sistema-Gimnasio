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
  ) {}

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

      // 1) duración (fija por ahora o tomada del servicio)
      const DURACION_MIN = 60; // o await this.getDuracionMin(dto.servicioId, 60);

      // 2) normalizar inicio y calcular fin del NUEVO turno
      const hInicioNorm = this.normHM(horaInicio);
      const hFinNorm = this.addMinutesHM(hInicioNorm, DURACION_MIN);

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
      if (error instanceof ConflictException) throw error; // 409 para solape
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
}
