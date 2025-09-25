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
exports.TurnosController = void 0;
const common_1 = require("@nestjs/common");
const turnos_service_1 = require("./turnos.service");
const crear_turno_dto_1 = require("./dto/crear-turno.dto");
const cancelar_turno_dto_1 = require("./dto/cancelar-turno.dto");
const disponibilidad_query_1 = require("./dto/disponibilidad.query");
const agenda_query_1 = require("./dto/agenda.query");
const swagger_1 = require("@nestjs/swagger");
const Turnos_entity_1 = require("../../entities/entities/Turnos.entity");
let TurnosController = class TurnosController {
    turnosService;
    constructor(turnosService) {
        this.turnosService = turnosService;
    }
    getDisponibles(q) {
        return this.turnosService.disponibilidad(q);
    }
    crear(dto) {
        return this.turnosService.crear(dto);
    }
    cancelar(id, dto) {
        return this.turnosService.cancelar(id, dto);
    }
    agenda(q) {
        return this.turnosService.agenda(q);
    }
    findOne(id) {
        return this.turnosService.getById(id);
    }
    listar(clienteId, estado) {
        return this.turnosService.listar({
            clienteId: clienteId ? Number(clienteId) : undefined,
            estado: estado || undefined,
        });
    }
};
exports.TurnosController = TurnosController;
__decorate([
    (0, common_1.Get)('disponibles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disponibilidad_query_1.DisponibilidadQuery]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "getDisponibles", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOkResponse)({ description: "Devuelve turno creado", type: Turnos_entity_1.Turnos }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_turno_dto_1.CrearTurnoDto]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cancelar_turno_dto_1.CancelarTurnoDto]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Get)('agenda'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agenda_query_1.AgendaQuery]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "agenda", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ type: Turnos_entity_1.Turnos, isArray: true }),
    __param(0, (0, common_1.Query)('clienteId')),
    __param(1, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "listar", null);
exports.TurnosController = TurnosController = __decorate([
    (0, common_1.Controller)('turnos'),
    __metadata("design:paramtypes", [turnos_service_1.TurnosService])
], TurnosController);
//# sourceMappingURL=turnos.controller.js.map