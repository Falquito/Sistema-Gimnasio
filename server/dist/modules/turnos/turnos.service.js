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
const Profesionales_entity_1 = require("../../entities/entities/Profesionales.entity");
const Recepcionista_entity_1 = require("../../entities/entities/Recepcionista.entity");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
let TurnosService = class TurnosService {
    dataSource;
    turnoRepo;
    profRepo;
    constructor(dataSource, turnoRepo, profRepo) {
        this.dataSource = dataSource;
        this.turnoRepo = turnoRepo;
        this.profRepo = profRepo;
    }
    async getDuracionMin(servicioId, fallback) {
        const duracion = 30;
        if (!duracion) {
            throw new common_1.UnprocessableEntityException('No se conoce la duración del servicio');
        }
        return Number(duracion);
    }
    onlyDate(v) {
        if (!v)
            return undefined;
        return v.length >= 10 ? v.slice(0, 10) : v;
    }
    normHM(hm) {
        const [hStr, mStr = '0'] = hm.split(':');
        const h = Number(hStr);
        const m = Number(mStr);
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(h)}:${pad(m)}`;
    }
    toMin(hm) {
        const [h, m] = hm.split(':').map(Number);
        return h * 60 + m;
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
            relations: ['idProfesional'],
        });
        if (!turno)
            throw new common_1.NotFoundException('Turno no encontrado');
        return turno;
    }
    getProfesionalId(turno) {
        return turno.idProfesional?.idProfesionales ?? turno.idProfesional;
    }
    async disponibilidad(q) {
        const duracionMin = await this.getDuracionMin(q.servicioId, q.duracionMin);
        if (!q.fecha) {
            throw new common_1.UnprocessableEntityException('Para este modelo usá ?fecha=YYYY-MM-DD');
        }
        let profesionalesIds = [];
        if (q.profesionalId) {
            profesionalesIds = [q.profesionalId];
        }
    }
    async crear(dto) {
        const { fecha, hora: horaInicio } = this.isoToParts(dto.inicio);
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const { pacienteId, observacion, profesionalId, recepcionistaId } = dto;
            const profesional = await queryRunner.manager.findOneBy(Profesionales_entity_1.Profesionales, { idProfesionales: profesionalId });
            const recepcionista = await queryRunner.manager.findOneBy(Recepcionista_entity_1.Recepcionista, { idRecepcionista: recepcionistaId });
            const paciente = await queryRunner.manager.findOneBy(paciente_entity_1.Paciente, { id_paciente: pacienteId });
            const DURACION_MIN = 60;
            const hInicioNorm = this.normHM(horaInicio);
            const hFinNorm = this.addMinutesHM(hInicioNorm, DURACION_MIN);
            const existentes = await queryRunner.manager
                .getRepository(Turnos_entity_1.Turnos)
                .createQueryBuilder('t')
                .where('t.id_profesional = :pid', { pid: profesionalId })
                .andWhere('t.fecha = :f', { f: fecha })
                .andWhere('t.estado != :cancel', { cancel: 'CANCELADO' })
                .getMany();
            const bStart = this.toMin(hInicioNorm);
            const bEnd = this.toMin(hFinNorm);
            const seSolapa = existentes.some((t) => {
                const ini = this.normHM(t.horaInicio);
                const fin = t.horaFin ? this.normHM(t.horaFin) : this.addMinutesHM(ini, DURACION_MIN);
                const aStart = this.toMin(ini);
                const aEnd = this.toMin(fin);
                return aStart < bEnd && aEnd > bStart;
            });
            if (seSolapa) {
                throw new common_1.ConflictException('El horario ya está ocupado');
            }
            const turno = queryRunner.manager.create(Turnos_entity_1.Turnos, {
                idRecepcionista: recepcionista,
                idPaciente: paciente,
                idProfesional: profesional,
                estado: 'PENDIENTE',
                observacion,
                fecha,
                horaInicio: hInicioNorm,
                fechaAlta: fecha,
                fechaUltUpd: '-',
            });
            await queryRunner.manager.save(turno);
            await queryRunner.commitTransaction();
            return turno;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelar(id, dto) {
        const turno = await this.getTurnoOrThrow(id);
        if (turno.estado === 'CANCELADO')
            return turno;
        turno.estado = 'CANCELADO';
        return await this.turnoRepo.save(turno);
    }
    async agenda(q) {
        const qb = this.turnoRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.idPaciente', 'paciente')
            .leftJoinAndSelect('t.idProfesional', 'profesional')
            .leftJoinAndSelect('t.idRecepcionista', 'recep');
        if (q.profesionalId != null) {
            qb.andWhere('t.id_profesional = :pid', { pid: q.profesionalId });
        }
        const d = this.onlyDate(q.desde);
        if (d)
            qb.andWhere('t.fecha >= :d', { d });
        const h = this.onlyDate(q.hasta);
        if (h)
            qb.andWhere('t.fecha <= :h', { h });
        if (q.estado) {
            qb.andWhere('t.estado = :e', { e: q.estado });
        }
        else {
            qb.andWhere('t.estado != :cancel', { cancel: 'CANCELADO' });
        }
        qb.orderBy('t.fecha', 'ASC').addOrderBy('t.horaInicio', 'ASC');
        const rows = await qb.getMany();
        console.log(`Agenda query - profesional: ${q.profesionalId}, fecha: ${d}, encontrados: ${rows.length} turnos`);
        return rows;
    }
    async listar(q) {
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
    async getById(id) {
        return this.getTurnoOrThrow(id);
    }
};
exports.TurnosService = TurnosService;
exports.TurnosService = TurnosService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(Turnos_entity_1.Turnos)),
    __param(2, (0, typeorm_2.InjectRepository)(Profesionales_entity_1.Profesionales)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        typeorm_1.Repository])
], TurnosService);
//# sourceMappingURL=turnos.service.js.map