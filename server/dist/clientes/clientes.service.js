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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Servicio_entity_1 = require("../entities/entities/Servicio.entity");
const cliente_entity_1 = require("./entities/cliente.entity");
const ClientesPorServicios_entity_1 = require("../entities/entities/ClientesPorServicios.entity");
let ClientesService = class ClientesService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async create(createClienteDto) {
        const { nombre, apellido, dni, altura, genero, fecha_alta, fecha_alta_upd, fecha_nacimiento, nivel_fisico, observaciones, peso, servicio, telefono } = createClienteDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const servicioBdd = await queryRunner.manager.findOneBy(Servicio_entity_1.Servicio, {
                nombre: servicio
            });
            const cliente = queryRunner.manager.create(cliente_entity_1.Cliente, {
                nombre_cliente: nombre,
                apellido_cliente: apellido,
                telefono_cliente: telefono,
                dni: dni,
                genero: genero,
                fecha_alta: fecha_alta,
                fecha_ult_upd: fecha_alta_upd,
                peso: peso,
                altura: altura,
                fecha_nacimiento: fecha_nacimiento,
                observaciones: observaciones,
                nivel_fisico: nivel_fisico,
            });
            await queryRunner.manager.save(cliente);
            const servicioPorCliente = queryRunner.manager.create(ClientesPorServicios_entity_1.ClientesPorServicios, {
                idCliente: cliente,
                idServicio: servicioBdd
            });
            await queryRunner.manager.save(servicioPorCliente);
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
    findAll() {
        return `This action returns all clientes`;
    }
    findOne(id) {
        return `This action returns a #${id} cliente`;
    }
    update(id, updateClienteDto) {
        return `This action updates a #${id} cliente`;
    }
    remove(id) {
        return `This action removes a #${id} cliente`;
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map