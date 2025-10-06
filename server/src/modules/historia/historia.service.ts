import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial  } from "typeorm";
import { CertezaDiagnostico, Diagnostico, EstadoDiagnostico } from "src/entities/entities/Diagnostico.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
import { CrearDiagnosticoDto } from "./dto/crear-diagnostico.dto";
import { UpdateDiagnosticoDto } from "./dto/update-diagnostico.dto";
import { AnotacionClinica } from "src/entities/entities/AnotacionClinica.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Profesionales } from "src/entities/entities/Profesionales.entity";
import { CrearAnotacionDto } from "./dto/crear-anotacion.dto";
import { UpdateAnotacionDto } from "./dto/update-anotacion.dto";
import { Medicacion } from "src/entities/entities/Medicacion.entity";
import { EstadoMedicacion } from "src/entities/entities/Medicacion.entity";
import { AdministrarMedicacionDto } from "./dto/administrar-medicacion.dto";
import { CrearMedicacionDto } from "./dto/crear-medicacion.dto";
import { UpdateMedicacionDto } from "./dto/update-medicacion.dto";





@Injectable()
export class HistoriaService {
  constructor(
    @InjectRepository(Diagnostico) private readonly diagRepo: Repository<Diagnostico>,
    @InjectRepository(Turnos) private readonly turnoRepo: Repository<Turnos>,
    @InjectRepository(AnotacionClinica) private readonly anotRepo: Repository<AnotacionClinica>,
    @InjectRepository(Paciente) private readonly pacRepo: Repository<Paciente>,
    @InjectRepository(Profesionales) private readonly profRepo: Repository<Profesionales>,
    @InjectRepository(Medicacion) private readonly medRepo: Repository<Medicacion>,
  ) {}

  private hoyYYYYMMDD() { return new Date().toISOString().slice(0, 10)}
  private assertFechaNoFutura(fecha: string) {
    if (!fecha) throw new BadRequestException("Fecha es requerida");
    const f = new Date(fecha + "T00:00:00");
    const hoy = new Date(this.hoyYYYYMMDD() + "T00:00:00");
    if (isNaN(+f)) throw new BadRequestException("Fecha inválida (YYYY-MM-DD)");
    if (f.getTime() > hoy.getTime()) throw new BadRequestException("Fecha no puede ser futura");
  }

  


  private async assertNoDuplicadoActivo(codigoCIE: string, pacienteId: number, excludeId?: number) {
    const qb = this.diagRepo.createQueryBuilder("d")
      .where("d.codigo_cie = :cie", { cie: codigoCIE })
      .andWhere("d.id_paciente = :pid", { pid: pacienteId })
      .andWhere("d.estado = :est", { est: EstadoDiagnostico.ACTIVO });
    if (excludeId) qb.andWhere("d.id_diagnostico <> :id", { id: excludeId });
    const exists = await qb.getCount();
    if (exists > 0) {
      throw new ConflictException("Ya existe un diagnóstico ACTIVO con ese código CIE para este paciente");
    }
  }


  private aplicarReglasEstadoCerteza(input: {
    estado?: EstadoDiagnostico;
    certeza?: CertezaDiagnostico;
  }): { estado: EstadoDiagnostico; certeza: CertezaDiagnostico } {
    const certeza = input.certeza ?? CertezaDiagnostico.EN_ESTUDIO;
    let estado = input.estado ?? EstadoDiagnostico.ACTIVO;
    if (certeza === CertezaDiagnostico.DESCARTADO) {
      estado = EstadoDiagnostico.CERRADO; // fuerza el cierre
    }
    return { estado, certeza };
  }

  
    async crearMedicacion(dto: CrearMedicacionDto) {
    // 1) Resolver paciente/profesional/turno
    let turno: Turnos | null = null;
    let paciente: Paciente;
    let profesional: Profesionales;

    if (dto.turnoId) {
      turno = await this.turnoRepo.findOne({ where: { idTurno: dto.turnoId } });
      if (!turno) throw new NotFoundException("Turno no encontrado");
      paciente = turno.idPaciente;
      profesional = turno.idProfesional;
    } else {
      if (!dto.pacienteId || !dto.profesionalId) {
        throw new BadRequestException("Debe enviar turnoId o (pacienteId y profesionalId)");
      }
      const p = await this.pacRepo.findOne({ where: { id_paciente: dto.pacienteId } });
      if (!p) throw new NotFoundException("Paciente no encontrado");
      const prof = await this.profRepo.findOne({ where: { idProfesionales: dto.profesionalId } });
      if (!prof) throw new NotFoundException("Profesional no encontrado");
      paciente = p; profesional = prof;
    }

    // 2) Validaciones mínimas
    if (!dto.farmaco?.trim()) throw new BadRequestException("farmaco es requerido");
    this.hoyYYYYMMDD();
    if (dto.fechaFin) this.hoyYYYYMMDD();
    if (dto.ultimaAdmin) this.hoyYYYYMMDD();

    const estado = dto.estado ?? EstadoMedicacion.ACTIVO;

    // Si crean como COMPLETADO y no pasaron fechaFin, la seteamos a fechaInicio/hoy
    const fechaFin = (estado === EstadoMedicacion.COMPLETADO && !dto.fechaFin)
      ? this.hoyYYYYMMDD()
      : dto.fechaFin ?? null;
    
      
    const med = this.medRepo.create({
      farmaco: dto.farmaco,
      dosis: dto.dosis,
      frecuencia: dto.frecuencia,
      indicacion: dto.indicacion,
      fechaInicio: dto.fechaInicio,
      fechaFin,
      ultimaAdmin: dto.ultimaAdmin ?? null,
      estado,
      idTurno: turno ?? null,
      idPaciente: paciente,
      idProfesional: profesional,
    } as DeepPartial<Medicacion>);

    return this.medRepo.save(med);
  }

  async actualizarMedicacion(id: number, dto: UpdateMedicacionDto) {
    const m = await this.medRepo.findOne({ where: { idMedicacion: id } });
    if (!m) throw new NotFoundException("Medicacion no encontrada");

    if (dto.fechaInicio) this.hoyYYYYMMDD();
    if (dto.fechaFin) this.hoyYYYYMMDD();
    if (dto.ultimaAdmin) this.hoyYYYYMMDD();

    Object.assign(m, dto);

    // Reglas: si estado pasa a COMPLETADO y no hay fechaFin -> setear hoy
    if (dto.estado === EstadoMedicacion.COMPLETADO && !m.fechaFin) {
      m.fechaFin = this.hoyYYYYMMDD();
    }
    // Si estado vuelve a ACTIVO -> limpiar fechaFin (opcional)
    if (dto.estado === EstadoMedicacion.ACTIVO) {
      // m.fechaFin = null;
    }

    return this.medRepo.save(m);
  }

  // registrar administración (actualiza ultimaAdmin)
  async administrarMedicacion(id: number, dto: AdministrarMedicacionDto) {
    const m = await this.medRepo.findOne({ where: { idMedicacion: id } });
    if (!m) throw new NotFoundException("Medicacion no encontrada");
    const fecha = dto.fecha ?? this.hoyYYYYMMDD();
    this.hoyYYYYMMDD();
    return this.medRepo.save(m);
  }

  // listado para la grilla con filtros
  async listarMedicaciones(
    pacienteId: number,
    f: { from?: string; to?: string; profesionalId?: number; servicio?: string; q?: string }
  ) {
    const qb = this.medRepo.createQueryBuilder("m")
      .leftJoinAndSelect("m.idProfesional", "p")
      .leftJoinAndSelect("m.idTurno", "t")
      .where("m.id_paciente = :pid", { pid: pacienteId });

    if (f.from) qb.andWhere("m.fecha_inicio >= :from", { from: f.from });
    if (f.to)   qb.andWhere("m.fecha_inicio <= :to",   { to: f.to });
    if (f.profesionalId) qb.andWhere("p.id_profesionales = :pro", { pro: f.profesionalId });
    if (f.servicio) qb.andWhere("p.servicio ILIKE :svc", { svc: `%${f.servicio}%` });
    if (f.q) qb.andWhere(`(
        m.farmaco ILIKE :q OR
        COALESCE(m.dosis,'') ILIKE :q OR
        COALESCE(m.frecuencia,'') ILIKE :q OR
        COALESCE(m.indicacion,'') ILIKE :q
      )`, { q: `%${f.q}%` });

    // Orden: recetadas más recientemente
    return qb.orderBy("m.fecha_inicio", "DESC").addOrderBy("m.creado_en", "DESC").getMany();
  }


      // ---- ANOTACIONES ----
  async crearAnotacion(dto: CrearAnotacionDto) {
    let paciente: Paciente | null = null;
    let profesional: Profesionales | null = null;
    let turno: Turnos | null = null;

    // Si viene turnoId, derivamos paciente/profesional de ahí
    if (dto.turnoId) {
      turno = await this.turnoRepo.findOne({ where: { idTurno: dto.turnoId } });
      if (!turno) throw new NotFoundException("Turno no encontrado");
      paciente = turno.idPaciente;
      profesional = turno.idProfesional;
    } else {
      // Requiere ambos ids
      if (!dto.pacienteId || !dto.profesionalId) {
        throw new BadRequestException("Debe enviar turnoId o (pacienteId y profesionalId)");
      }
      paciente = await this.pacRepo.findOne({ where: { id_paciente: dto.pacienteId } });
      if (!paciente) throw new NotFoundException("Paciente no encontrado");
      profesional = await this.profRepo.findOne({ where: { idProfesionales: dto.profesionalId } });
      if (!profesional) throw new NotFoundException("Profesional no encontrado");
    }

    const fecha = dto.fecha ?? this.hoyYYYYMMDD();
    const hora = dto.hora ?? (turno?.horaInicio ?? null);

    const anot = this.anotRepo.create({
      fecha,
      texto: dto.texto,
      idPaciente: paciente!,
      idProfesional: profesional!,
    });

    return this.anotRepo.save(anot);
  }

  async getAnotacion(id: number) {
    const a = await this.anotRepo.findOne({ where: { idAnotacion: id } });
    if (!a) throw new NotFoundException("Anotación no encontrada");
    return a;
  }

  async actualizarAnotacion(id: number, dto: UpdateAnotacionDto) {
    const a = await this.getAnotacion(id);
    if (dto.fecha) a.fecha = dto.fecha;
    if (dto.hora) a.hora = dto.hora;
    if (dto.texto) a.texto = dto.texto;
    return this.anotRepo.save(a);
  }

  // Para la grilla/timeline con filtros y búsqueda
  async listarAnotaciones(
    pacienteId: number,
    f: { from?: string; to?: string; profesionalId?: number; servicio?: string; q?: string }
  ) {
    const qb = this.anotRepo.createQueryBuilder("a")
      .leftJoinAndSelect("a.idTurno", "t")
      .leftJoinAndSelect("a.idProfesional", "p")
      .where("a.id_paciente = :pid", { pid: pacienteId });

    if (f.from) qb.andWhere("a.fecha >= :from", { from: f.from });
    if (f.to) qb.andWhere("a.fecha <= :to", { to: f.to });
    if (f.profesionalId) qb.andWhere("p.id_profesionales = :pro", { pro: f.profesionalId });
    if (f.servicio) qb.andWhere("p.servicio ILIKE :svc", { svc: `%${f.servicio}%` });
    if (f.q) qb.andWhere("(a.texto ILIKE :q)", { q: `%${f.q}%` });

    // Orden descendente por fecha y hora
    return qb.orderBy("a.fecha", "DESC")
             .addOrderBy("a.hora", "DESC", "NULLS LAST")
             .getMany();
  }


      // ---- DIAGNOSTICO ----

  async crear(dto: CrearDiagnosticoDto) {
    const turno = await this.turnoRepo.findOne({ where: { idTurno: dto.turnoId } });
    if (!turno) throw new NotFoundException("Turno no encontrado");
    if (turno.estado === "CANCELADO") throw new ConflictException("No se puede diagnosticar un turno cancelado");

    const fecha = dto.fecha ?? this.hoyYYYYMMDD();
    this.assertFechaNoFutura(fecha);

    const { estado, certeza } = this.aplicarReglasEstadoCerteza(dto);

    // validación de duplicado activo por paciente + CIE
    const pacienteId = turno.idPaciente.id_paciente;
    await this.assertNoDuplicadoActivo(dto.codigoCIE, pacienteId);

    const diag = this.diagRepo.create({
      idPaciente: turno.idPaciente,
      idProfesional: turno.idProfesional,
    });
    
    

    const saved = await this.diagRepo.save(diag);

    // marca turno como COMPLETADO
    if (turno.estado !== "COMPLETADO") {
      turno.estado = "COMPLETADO";
      await this.turnoRepo.save(turno);
    }

    return saved;
  }

  async getUno(id: number) {
    const d = await this.diagRepo.findOne({ where: { idDiagnostico: id } });
    if (!d) throw new NotFoundException("Diagnóstico no encontrado");
    return d;
  }

  async actualizar(id: number, dto: UpdateDiagnosticoDto) {
    const d = await this.getUno(id);

    // fecha (si viene) no futura
    if (dto.fecha) this.assertFechaNoFutura(dto.fecha);

    // reevaluar estado/certidumbre
    const { estado, certeza } = this.aplicarReglasEstadoCerteza({
      estado: dto.estado ?? d.estado,
      certeza: dto.certeza ?? d.certeza,
    });
    if (estado === 'CERRADO' && !d.fechaCierre) {
      d.fechaCierre = (dto.fecha ?? d.fecha) || this.hoyYYYYMMDD();
    }

    // si cambia CIE o estado→ACTIVO, volver a chequear duplicados
    const nuevoCIE = dto.codigoCIE ?? d.codigoCIE;

    
    if (estado === EstadoDiagnostico.ACTIVO) {
      await this.assertNoDuplicadoActivo(nuevoCIE, d.idPaciente.id_paciente, d.idDiagnostico);
    }

    d.fecha = dto.fecha ?? d.fecha;
    d.estado = estado;
    d.certeza = certeza;
    d.codigoCIE = nuevoCIE;
    d.sintomasPrincipales = dto.sintomasPrincipales ?? d.sintomasPrincipales;
    d.observaciones = dto.observaciones ?? d.observaciones;

    return this.diagRepo.save(d);
  }

  async historialPaciente(pacienteId: number) {
    return this.diagRepo.createQueryBuilder("d")
      .leftJoinAndSelect("d.idTurno", "t")
      .leftJoinAndSelect("d.idProfesional", "p")
      .where("d.id_paciente = :pid", { pid: pacienteId })
      .orderBy("d.creado_en", "DESC")
      .getMany();
  }




  async listarDiagnosticos(pacienteId: number, f: { from?: string; to?: string; profesionalId?: number; servicio?: string; q?: string; }) {
    const qb = this.diagRepo.createQueryBuilder('d')
      .leftJoinAndSelect('d.idTurno', 't')
      .leftJoinAndSelect('d.idProfesional', 'p')
      .where('d.id_paciente = :pid', { pid: pacienteId });

    if (f.from) qb.andWhere('d.fecha >= :from', { from: f.from });
    if (f.to)   qb.andWhere('d.fecha <= :to',   { to: f.to });
    if (f.profesionalId) qb.andWhere('p.id_profesionales = :pro', { pro: f.profesionalId });
    if (f.servicio) qb.andWhere('p.servicio ILIKE :svc', { svc: `%${f.servicio}%` });
    if (f.q) qb.andWhere(`(
        d.codigo_cie ILIKE :q OR
        d.sintomas_principales ILIKE :q OR
        COALESCE(d.observaciones,'') ILIKE :q
      )`, { q: `%${f.q}%` });

    return qb.orderBy('d.fecha', 'DESC').addOrderBy('t.horaInicio', 'DESC').getMany();
}
}
