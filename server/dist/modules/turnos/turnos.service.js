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
        console.log(duracion);
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
    }
    async crear(dto) {
        const { fecha, hora: horaInicio } = this.isoToParts(dto.inicio);
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const { pacienteId, inicio, observacion, profesionalId, recepcionistaId } = dto;
            const profesional = await queryRunner.manager.findOneBy(Profesionales_entity_1.Profesionales, { idProfesionales: profesionalId });
            const recepcionista = await queryRunner.manager.findOneBy(Recepcionista_entity_1.Recepcionista, { idRecepcionista: recepcionistaId });
            const paciente = await queryRunner.manager.findOneBy(paciente_entity_1.Paciente, {
                id_paciente: pacienteId
            });
            const turno = queryRunner.manager.create(Turnos_entity_1.Turnos, {
                idRecepcionista: recepcionista,
                idPaciente: paciente,
                idProfesional: profesional,
                estado: "PENDIENTE",
                observacion: observacion,
                fecha: fecha,
                horaInicio: horaInicio,
                fechaAlta: fecha,
                fechaUltUpd: "-"
            });
            await queryRunner.manager.save(turno);
            await queryRunner.commitTransaction();
            return turno;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelar(id, dto) {
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
        const qb = this.turnoRepo.createQueryBuilder('t');
        if (q.clienteId)
            qb.andWhere('t.clienteId = :cid', { cid: q.clienteId });
        if (q.estado)
            qb.andWhere('t.estado = :e', { e: q.estado });
        qb.orderBy('t.hora_inicio', 'DESC');
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
;
//# sourceMappingURL=turnos.service.js.map