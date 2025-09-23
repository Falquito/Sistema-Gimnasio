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
exports.ProfesionalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Profesionales_entity_1 = require("../../entities/entities/Profesionales.entity");
const Servicio_entity_1 = require("../../entities/entities/Servicio.entity");
const ProfesionalesPorServicios_entity_1 = require("../../entities/entities/ProfesionalesPorServicios.entity");
let ProfesionalesService = class ProfesionalesService {
    profRepo;
    servRepo;
    ppsRepo;
    constructor(profRepo, servRepo, ppsRepo) {
        this.profRepo = profRepo;
        this.servRepo = servRepo;
        this.ppsRepo = ppsRepo;
    }
    async findAll(q) {
        const page = q.page ?? 1;
        const limit = q.limit ?? 20;
        const skip = (page - 1) * limit;
        const qb = this.profRepo.createQueryBuilder('p');
        if (q.q) {
            qb.andWhere('(p.nombre ILIKE :q OR p.apellido ILIKE :q OR p.email ILIKE :q)', { q: `%${q.q}%` });
        }
        if (typeof q.activo !== 'undefined') {
            const activoBool = q.activo === 'true';
            qb.andWhere('p.activo = :activo', { activo: activoBool });
        }
        if (q.servicioId) {
            qb.innerJoin(ProfesionalesPorServicios_entity_1.ProfesionalesPorServicios, 'pps', 'pps.profesional_id = p.id')
                .andWhere('pps.servicio_id = :sid', { sid: q.servicioId });
        }
        qb.orderBy('p.apellido', 'ASC').addOrderBy('p.nombre', 'ASC');
        qb.take(limit).skip(skip);
        const [items, total] = await qb.getManyAndCount();
        return {
            page,
            limit,
            total,
            items,
        };
    }
    async findOne(id) {
        const profesional = await this.profRepo.findOne({
            where: { idProfesionales: id },
        });
        if (!profesional) {
            throw new common_1.NotFoundException('Profesional no encontrado');
        }
        return profesional;
    }
    async findServiciosByProfesional(id) {
        await this.ensureProfesional(id);
        const qb = this.servRepo
            .createQueryBuilder('s')
            .innerJoin(ProfesionalesPorServicios_entity_1.ProfesionalesPorServicios, 'pps', 'pps.servicio_id = s.id')
            .where('pps.profesional_id = :pid', { pid: id })
            .orderBy('s.nombre', 'ASC');
        return qb.getMany();
    }
    async ensureProfesional(id) {
        const exists = await this.profRepo.exist({ where: { idProfesionales: id } });
        if (!exists)
            throw new common_1.NotFoundException('Profesional no encontrado');
    }
};
exports.ProfesionalesService = ProfesionalesService;
exports.ProfesionalesService = ProfesionalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Profesionales_entity_1.Profesionales)),
    __param(1, (0, typeorm_1.InjectRepository)(Servicio_entity_1.Servicio)),
    __param(2, (0, typeorm_1.InjectRepository)(ProfesionalesPorServicios_entity_1.ProfesionalesPorServicios)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProfesionalesService);
//# sourceMappingURL=profesionales.service.js.map