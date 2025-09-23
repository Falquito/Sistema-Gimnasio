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
exports.ProfesionalesController = void 0;
const common_1 = require("@nestjs/common");
const profesionales_service_1 = require("./profesionales.service");
const list_profesionales_query_1 = require("./dto/list-profesionales.query");
let ProfesionalesController = class ProfesionalesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(q) {
        return this.service.findAll(q);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    findServicios(id) {
        return this.service.findServiciosByProfesional(id);
    }
};
exports.ProfesionalesController = ProfesionalesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_profesionales_query_1.ListProfesionalesQuery]),
    __metadata("design:returntype", void 0)
], ProfesionalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfesionalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/servicios'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfesionalesController.prototype, "findServicios", null);
exports.ProfesionalesController = ProfesionalesController = __decorate([
    (0, common_1.Controller)('profesionales'),
    __metadata("design:paramtypes", [profesionales_service_1.ProfesionalesService])
], ProfesionalesController);
//# sourceMappingURL=profesionales.controller.js.map