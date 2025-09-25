import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Turnos } from 'src/entities/entities/Turnos.entity';
// import { Servicio } from 'src/entities/entities/Servicio.entity';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
// import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';

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
    // @InjectRepository(Servicio) private readonly servRepo: Repository<Servicio>,
    @InjectRepository(Profesionales) private readonly profRepo: Repository<Profesionales>,
    // @InjectRepository(ProfesionalesPorServicios) private readonly ppsRepo: Repository<ProfesionalesPorServicios>,
 
  
  ) {}

  // ====== UTIL ======

  private async getDuracionMin(servicioId: number, fallback?: number): Promise<number> {

    // const servicio = await this.servRepo.findOne({ where: { idServicio: servicioId } });
    // if (!servicio) throw new NotFoundException('Servicio no encontrado');

    // @ts-ignore
    const duracion =30
    console.log(duracion)
    if (!duracion) {
      throw new UnprocessableEntityException('No se conoce la duración del servicio');
    }
    return Number(duracion);
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
    /** Trae el turno por id o lanza 404. Incluyo relaciones que usás luego. */
  private async getTurnoOrThrow(id: number) {
    const turno = await this.turnoRepo.findOne({
      where: { idTurno: id },
      relations: [ 'idProfesional'], // ← tus relaciones reales
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return turno;
  }

  /** Helper para obtener el id numérico de servicio desde la relación */
  // private getServicioId(turno: Turnos): number {
  //   // idServicio es una relación (Servicio). Sacamos su PK.
  //   return (turno.idServicio as any)?.idServicio ?? (turno as any).idServicio;
  // }

  /** Helper para obtener el id numérico del profesional desde la relación */
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
    let profesionalesIds: number[];
    if (q.profesionalId) {
      profesionalesIds = [q.profesionalId];}

    //  else {
    //   const rows = await this.ppsRepo.createQueryBuilder('pps')
    //     .select('pps.idProfesionales', 'pid')  // nombre real
    //     .where('pps.idServicio = :sid', { sid: q.servicioId })
    //     .getRawMany();
    //   profesionalesIds = rows.map(r => Number(r.pid));
    //   if (!profesionalesIds.length) return { servicioId: q.servicioId, duracionMin, slots: [] };
    // }

    // turnos ocupados del día
  //   type Ocupado = { horaInicio: string; horaFin: string; id_profesional: number };
  //   const ocupados: Ocupado[] = await this.turnoRepo.createQueryBuilder('t')
  //     .select(['t.horaInicio AS "horaInicio"', 't.horaFin AS "horaFin"', 't.id_profesional AS "id_profesional"'])
  //     .where('t.fecha = :f', { f: q.fecha })
  //     .andWhere('t.id_profesional IN (:...pids)', { pids: profesionalesIds })
  //     .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
  //     .getRawMany<Ocupado>();

  //   const slots: { profesionalId: number; fecha: string; horaInicio: string; horaFin: string }[] = [];
  //   for (const pid of profesionalesIds) {
  //     //ejemplo horario laboral
  //     let cursor = '08:00';
  //     const finDia = '20:00';
  //     while (cursor < finDia) {
  //       const hi = cursor;
  //       const hf = this.addMinutesHM(hi, duracionMin);

  //       const haySolape = ocupados
  //         .filter(o => o.id_profesional === pid)
  //         .some(o => o.horaInicio < hf && o.horaFin > hi);

  //       if (!haySolape) {
  //         slots.push({ profesionalId: pid, fecha: q.fecha, horaInicio: hi, horaFin: hf });
  //       }
  //       cursor = this.addMinutesHM(cursor, duracionMin);
  //     }
  //   }

  //   return { servicioId: q.servicioId, duracionMin, slots };
  }





    // ====== HU-5: CREAR ======
  async crear( dto: CrearTurnoDto) {
    const { fecha, hora: horaInicio } = this.isoToParts(dto.inicio);
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const {pacienteId,inicio,observacion,profesionalId,recepcionistaId} = dto

      const profesional = await queryRunner.manager.findOneBy(Profesionales,{idProfesionales:profesionalId})

      const recepcionista = await queryRunner.manager.findOneBy(Recepcionista,{idRecepcionista:recepcionistaId})

      const paciente = await queryRunner.manager.findOneBy(Paciente,{
        id_paciente:pacienteId
      })

      const turno = queryRunner.manager.create(Turnos,{
        idRecepcionista:recepcionista!,
        idPaciente:paciente!,
        idProfesional:profesional!,
        estado:"PENDIENTE",
        observacion:observacion,
        fecha:fecha,
        horaInicio:horaInicio,
        fechaAlta:fecha,
        fechaUltUpd:"-"

      })

      await queryRunner.manager.save(turno)
      await queryRunner.commitTransaction()
      return turno;
      // return await this.dataSource.transaction(async (mgr) => {
      //   valida profesional ↔ servicio (bloque anterior)
      
      //   chequear solape: mismo día y rangos de hora
      //   const solapa = await mgr.getRepository(Turnos)
      //     .createQueryBuilder('t')
      //     .where('t.idProfesional = :pid', { pid: dto.profesionalId })
      //     .andWhere('t.fecha = :f', { f: fecha })
      //     .andWhere('t.horaInicio < :hf AND t.horaFin > :hi', {
      //       hi: horaInicio,
      //       hf: horaFin,
      //     })
      //     .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
      //     .getExists();
      //   if (solapa) throw new ConflictException('El horario ya está ocupado');
        
      //   crear usando los nombres de TU entidad:
      //   const turno = mgr.getRepository(Turnos).create({
      //     idCliente: dto.clienteId,                 // FK plana
      //     idServicio: { idServicio: dto.servicioId },       // relación
      //     idProfesional: { idProfesionales: dto.profesionalId }, // relación
      //     fecha,                                     // "YYYY-MM-DD"
      //     horaInicio:horaInicio,                                // "HH:mm"
      //     horaFin:horaFin,                                   // "HH:mm"
      //     estado: 'PENDIENTE',
      //     rutina:dto.rutina,
      //     observacion:dto.observacion,
      //     fechaAlta:fecha,
      //     fechaUltUpd:"-"
      //   });
      
      //   return mgr.getRepository(Turnos).save(turno);
      // });
    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new InternalServerErrorException(error)
      // if (e?.code === '23505') throw new ConflictException('El horario ya fue tomado');
      // throw e;
    }finally{
      await queryRunner.release()
    }
  }
  



  // ====== HU-6a: CANCELAR ======
  async cancelar(id: number, dto: CancelarTurnoDto) {
    const turno = await this.getTurnoOrThrow(id);
  
    if (turno.estado === 'CANCELADO') return turno;
  
    turno.estado = 'CANCELADO';
    return await this.turnoRepo.save(turno);
  }
  
  async agenda(q: { profesionalId: number; desde: string; estado?: string }) {
    
    if(q.desde && q.profesionalId && q.estado){
      return this.turnoRepo.createQueryBuilder('t')
      .where('t.id_profesional = :pid', { pid: q.profesionalId })
      .andWhere('t.fecha >= :d', { d: q.desde})
      .andWhere(q.estado ? 't.estado = :e' : '1=1', { e: q.estado })
      .orderBy('t.fecha', 'ASC')
      .addOrderBy('t.horaInicio', 'ASC')
      .getMany(); 
    }else if(q.profesionalId && q.estado){
      return this.turnoRepo.createQueryBuilder('t')
      .where('t.id_profesional = :pid', { pid: q.profesionalId })
      .andWhere(q.estado ? 't.estado = :e' : '1=1', { e: q.estado })
      .orderBy('t.fecha', 'ASC')
      .addOrderBy('t.horaInicio', 'ASC')
      .getMany();
    }else if(q.desde){
      return this.turnoRepo.createQueryBuilder('t')
      .where('t.fecha >= :d', { d: q.desde})
      .orderBy('t.fecha', 'ASC')
      .addOrderBy('t.horaInicio', 'ASC')
      .getMany();
    }else if(q.profesionalId){
      return this.turnoRepo.createQueryBuilder('t')
      .where('t.id_profesional = :pid', { pid: q.profesionalId})
      .orderBy('t.fecha', 'ASC')
      .addOrderBy('t.horaInicio', 'ASC')
      .getMany();
    }else if(q.estado){
      return this.turnoRepo.createQueryBuilder('t')
      .where(q.estado ? 't.estado = :e' : '1=1', { e: q.estado })
      .orderBy('t.fecha', 'ASC')
      .addOrderBy('t.horaInicio', 'ASC')
      .getMany(); 
    }

<<<<<<< HEAD


  async agenda(q: { profesionalId: number; desde: string; hasta: string; estado?: string }) {
  return this.turnoRepo.createQueryBuilder('t')
    .where('t.id_profesional = :pid', { pid: q.profesionalId })
    .andWhere('t.fecha BETWEEN :d AND :h', { d: q.desde, h: q.hasta })
    .andWhere(q.estado ? 't.estado = :e' : '1=1', { e: q.estado })
    .orderBy('t.fecha', 'ASC')
    .addOrderBy('t.horaInicio', 'ASC')
    .getMany();
  }
  
  async listar(q: { clienteId?: number; estado?: string }) {
  const qb = this.turnoRepo.createQueryBuilder('t')
    .leftJoinAndSelect('t.idServicio', 'servicio')
    .leftJoinAndSelect('t.idProfesional', 'profesional')
    .leftJoinAndSelect('t.idCliente', 'cliente');  // ← Agregar este JOIN
    
  if (q.clienteId) qb.andWhere('t.idCliente = :cid', { cid: q.clienteId });
  if (q.estado) qb.andWhere('t.estado = :e', { e: q.estado });
  
  qb.orderBy('t.fecha', 'DESC')
    .addOrderBy('t.horaInicio', 'DESC');
  
  return qb.getMany();
}
=======
    throw new BadRequestException("Necesito que mandes por lo menos algunos de {profesionalId,estado,desde}")
    
    }
    
  async listar(q: { pacienteId?: number; estado?: string }) {
    const qb = this.turnoRepo.createQueryBuilder('t');
    if (q.pacienteId) qb.andWhere('t.clienteId = :cid', { cid: q.pacienteId });
    if (q.estado) qb.andWhere('t.estado = :e', { e: q.estado });
    qb.orderBy('t.hora_inicio', 'DESC');
    return qb.getMany();
  }
>>>>>>> 4476f43cac5131d7f9601eb86c55c06caa1c8982
  public async getById(id: number) {
    return this.getTurnoOrThrow(id);
  }
};