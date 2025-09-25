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
exports.PacienteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paciente_entity_1 = require("./entities/paciente.entity");
const ObraSocial_entity_1 = require("../entities/entities/ObraSocial.entity");
let PacienteService = class PacienteService {
    dataSource;
    pacienteRepository;
    constructor(dataSource, pacienteRepository) {
        this.dataSource = dataSource;
        this.pacienteRepository = pacienteRepository;
    }
    async create(createPacienteDto) {
        const { nombre, apellido, dni, genero, fecha_nacimiento, observaciones, telefono, email, nro_obraSocial, id_obraSocial } = createPacienteDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const obraSocial = await queryRunner.manager.findOneBy(ObraSocial_entity_1.ObraSocial, {
                id_os: id_obraSocial
            });
            const cliente = queryRunner.manager.create(paciente_entity_1.Paciente, {
                nombre_paciente: nombre,
                apellido_paciente: apellido,
                telefono_paciente: telefono,
                dni: dni,
                genero: genero,
                fecha_nacimiento: fecha_nacimiento,
                observaciones: observaciones,
                email: email,
                nro_obrasocial: nro_obraSocial,
                obraSocial: obraSocial
            });
            await queryRunner.manager.save(cliente);
            await queryRunner.commitTransaction();
            return cliente;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return await this.pacienteRepository.find();
    }
    async update(id, updatePacienteDto) {
        const paciente = await this.pacienteRepository.findOneBy({ id_paciente: id });
        if (!paciente) {
            throw new common_1.NotFoundException(`No se encontro el paiente con el id: ${id}`);
        }
        const pacienteUpdated = await this.pacienteRepository.preload({
            id_paciente: paciente.id_paciente,
            apellido_paciente: updatePacienteDto.apellido ? updatePacienteDto.apellido : paciente.apellido_paciente,
            nombre_paciente: updatePacienteDto.nombre ? updatePacienteDto.nombre : paciente.nombre_paciente,
            fecha_nacimiento: updatePacienteDto.fecha_nacimiento ? updatePacienteDto.fecha_nacimiento : paciente.fecha_nacimiento,
            dni: updatePacienteDto.dni ? updatePacienteDto.dni : paciente.dni,
            genero: updatePacienteDto.genero ? updatePacienteDto.genero : paciente.genero,
            observaciones: updatePacienteDto.observaciones ? updatePacienteDto.observaciones : paciente.observaciones,
            telefono_paciente: updatePacienteDto.telefono ? updatePacienteDto.telefono : paciente.telefono_paciente,
        });
        return this.pacienteRepository.save(pacienteUpdated);
    }
    async findOne(id) {
        return await this.pacienteRepository.findOneBy({ id_paciente: id });
    }
    async remove(id) {
        const paciente = await this.findOne(id);
        const pacienteDeleted = await this.pacienteRepository.preload({ ...paciente, estado: false });
        return await this.pacienteRepository.save(pacienteDeleted);
    }
};
exports.PacienteService = PacienteService;
exports.PacienteService = PacienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], PacienteService);
//# sourceMappingURL=pacientes.service.js.map