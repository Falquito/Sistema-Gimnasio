"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const Turnos_entity_1 = require("../../entities/entities/Turnos.entity");
const Servicio_entity_1 = require("../../entities/entities/Servicio.entity");
const Profesionales_entity_1 = require("../../entities/entities/Profesionales.entity");
const ProfesionalesPorServicios_entity_1 = require("../../entities/entities/ProfesionalesPorServicios.entity");
let TurnosService = class TurnosService {
    dataSource;
    turnoRepo;
    servRepo;
    profRepo;
    ppsRepo;
    constructor(dataSource, turnoRepo, servRepo, profRepo, ppsRepo) {
        this.dataSource = dataSource;
        this.turnoRepo = turnoRepo;
        this.servRepo = servRepo;
        this.profRepo = profRepo;
        this.ppsRepo = ppsRepo;
    }
    async getDuracionMin(servicioId, fallback) {
        const servicio = await this.servRepo.findOne({ where: { idServicio: servicioId } });
        if (!servicio)
            throw new common_1.NotFoundException('Servicio no encontrado');
        const duracion = servicio.duracionMin ?? fallback;
        if (!duracion) {
            throw new common_1.UnprocessableEntityException('No se conoce la duración del servicio');
        }
        return Number(duracion);
    }
    isoToParts(iso) {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return { fecha: `${y}-${m}-${day}`, hora: `${hh}:${mm}` };
    }
    addMinutesHM(hora, min) {
        const [hh, mm] = hora.split(':').map(Number);
        const base = new Date(0, 0, 1, hh, mm, 0, 0);
        base.setMinutes(base.getMinutes() + min);
        const H = String(base.getHours()).padStart(2, '0');
        const M = String(base.getMinutes()).padStart(2, '0');
        return `${H}:${M}`;
    }
    async getTurnoOrThrow(id) {
        const turno = await this.turnoRepo.findOne({
            where: { idTurno: id },
            relations: ['idServicio', 'idProfesional'],
        });
        if (!turno)
            throw new common_1.NotFoundException('Turno no encontrado');
        return turno;
    }
    getServicioId(turno) {
        return turno.idServicio?.idServicio ?? turno.idServicio;
    }
    getProfesionalId(turno) {
        return turno.idProfesional?.idProfesionales ?? turno.idProfesional;
    }
    async disponibilidad(q) {
        const duracionMin = await this.getDuracionMin(q.servicioId, q.duracionMin);
        if (!q.fecha) {
            throw new common_1.UnprocessableEntityException('Para este modelo usá ?fecha=YYYY-MM-DD');
        }
        let profesionalesIds;
        if (q.profesionalId) {
            profesionalesIds = [q.profesionalId];
        }
        else {
            const rows = await this.ppsRepo.createQueryBuilder('pps')
                .select('pps.idProfesionales', 'pid')
                .where('pps.idServicio = :sid', { sid: q.servicioId })
                .getRawMany();
            profesionalesIds = rows.map(r => Number(r.pid));
            if (!profesionalesIds.length)
                return { servicioId: q.servicioId, duracionMin, slots: [] };
        }
        const ocupados = await this.turnoRepo.createQueryBuilder('t')
            .select(['t.horaInicio AS "horaInicio"', 't.horaFin AS "horaFin"', 't.id_profesional AS "id_profesional"'])
            .where('t.fecha = :f', { f: q.fecha })
            .andWhere('t.id_profesional IN (:...pids)', { pids: profesionalesIds })
            .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
            .getRawMany();
        const slots = [];
        for (const pid of profesionalesIds) {
            let cursor = '08:00';
            const finDia = '20:00';
            while (cursor < finDia) {
                const hi = cursor;
                const hf = this.addMinutesHM(hi, duracionMin);
                const haySolape = ocupados
                    .filter(o => o.id_profesional === pid)
                    .some(o => o.horaInicio < hf && o.horaFin > hi);
                if (!haySolape) {
                    slots.push({ profesionalId: pid, fecha: q.fecha, horaInicio: hi, horaFin: hf });
                }
                cursor = this.addMinutesHM(cursor, duracionMin);
            }
        }
        return { servicioId: q.servicioId, duracionMin, slots };
    }
    async crear(dto) {
        const duracionMin = await this.getDuracionMin(dto.servicioId);
        const { fecha, hora: horaInicio } = this.isoToParts(dto.inicio);
        const horaFin = this.addMinutesHM(horaInicio, duracionMin);
        try {
            return await this.dataSource.transaction(async (mgr) => {
                const solapa = await mgr.getRepository(Turnos_entity_1.Turnos)
                    .createQueryBuilder('t')
                    .where('t.idProfesional = :pid', { pid: dto.profesionalId })
                    .andWhere('t.fecha = :f', { f: fecha })
                    .andWhere('t.horaInicio < :hf AND t.horaFin > :hi', {
                    hi: horaInicio,
                    hf: horaFin,
                })
                    .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
                    .getExists();
                if (solapa)
                    throw new common_1.ConflictException('El horario ya está ocupado');
                const turno = mgr.getRepository(Turnos_entity_1.Turnos).create({
                    idCliente: dto.clienteId,
                    idServicio: { idServicio: dto.servicioId },
                    idProfesional: { idProfesionales: dto.profesionalId },
                    fecha,
                    horaInicio,
                    horaFin,
                    estado: 'PENDIENTE',
                });
                return mgr.getRepository(Turnos_entity_1.Turnos).save(turno);
            });
        }
        catch (e) {
            if (e?.code === '23505')
                throw new common_1.ConflictException('El horario ya fue tomado');
            throw e;
        }
    }
    async cancelar(id, dto) {
        const turno = await this.getTurnoOrThrow(id);
        if (turno.estado === 'CANCELADO')
            return turno;
        turno.estado = 'CANCELADO';
        turno.motivoCancelacion = dto.motivo ?? null;
        return this.turnoRepo.save(turno);
    }
    async reprogramar(id, dto) {
        const turno = await this.getTurnoOrThrow(id);
        if (turno.estado === 'CANCELADO') {
            throw new common_1.UnprocessableEntityException('No se puede reprogramar un turno cancelado');
        }
        const servicioId = this.getServicioId(turno);
        const duracionMin = await this.getDuracionMin(servicioId);
        const { fecha, hora: nuevaHI } = this.isoToParts(dto.nuevoInicio);
        const nuevaHF = this.addMinutesHM(nuevaHI, duracionMin);
        const profesionalId = this.getProfesionalId(turno);
        const solapa = await this.turnoRepo.createQueryBuilder('t')
            .where('t.id_profesional = :pid', { pid: profesionalId })
            .andWhere('t.id_turno != :id', { id })
            .andWhere('t.fecha = :f', { f: fecha })
            .andWhere('t.horaInicio < :hf AND t.horaFin > :hi', { hi: nuevaHI, hf: nuevaHF })
            .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
            .getExists();
        if (solapa)
            throw new common_1.ConflictException('El nuevo horario está ocupado');
        turno.fecha = fecha;
        turno.horaInicio = nuevaHI;
        turno.horaFin = nuevaHF;
        turno.estado = 'PENDIENTE';
        return this.turnoRepo.save(turno);
    }
    async agenda(q) {
        return this.turnoRepo.createQueryBuilder('t')
            .where('t.id_profesional = :pid', { pid: q.profesionalId })
            .andWhere('t.fecha BETWEEN :d AND :h', { d: q.desde, h: q.hasta })
            .andWhere(q.estado ? 't.estado = :e' : '1=1', { e: q.estado })
            .orderBy('t.fecha', 'ASC')
            .addOrderBy('t.horaInicio', 'ASC')
            .getMany();
    }
    async listar(q) {
        const qb = this.turnoRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.idServicio', 'servicio')
            .leftJoinAndSelect('t.idProfesional', 'profesional')
            .leftJoinAndSelect('t.idCliente', 'cliente');
        if (q.clienteId)
            qb.andWhere('t.idCliente = :cid', { cid: q.clienteId });
        if (q.estado)
            qb.andWhere('t.estado = :e', { e: q.estado });
        qb.orderBy('t.fecha', 'DESC')
            .addOrderBy('t.horaInicio', 'DESC');
        return qb.getMany();
    }
    async getById(id) {
        return this.getTurnoOrThrow(id);
    }
};
exports.TurnosService = TurnosService;
exports.TurnosService = TurnosService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(Turnos_entity_1.Turnos)),
    __param(2, (0, typeorm_2.InjectRepository)(Servicio_entity_1.Servicio)),
    __param(3, (0, typeorm_2.InjectRepository)(Profesionales_entity_1.Profesionales)),
    __param(4, (0, typeorm_2.InjectRepository)(ProfesionalesPorServicios_entity_1.ProfesionalesPorServicios)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], TurnosService);
;
//# sourceMappingURL=turnos.service.js.map