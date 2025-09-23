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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servicio = void 0;
const typeorm_1 = require("typeorm");
const ClientesPorServicios_entity_1 = require("./ClientesPorServicios.entity");
const ProfesionalesPorServicios_entity_1 = require("./ProfesionalesPorServicios.entity");
const Turnos_entity_1 = require("./Turnos.entity");
let Servicio = class Servicio {
    idServicio;
    nombre;
    clientesPorServicios;
    profesionalesPorServicios;
    turnos;
};
exports.Servicio = Servicio;
__decorate([
    (0, typeorm_1.Column)("integer", { primary: true, name: "id_servicio" }),
    __metadata("design:type", Number)
], Servicio.prototype, "idServicio", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "nombre", nullable: true }),
    __metadata("design:type", Object)
], Servicio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ClientesPorServicios_entity_1.ClientesPorServicios, (clientesPorServicios) => clientesPorServicios.idServicio),
    __metadata("design:type", Array)
], Servicio.prototype, "clientesPorServicios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProfesionalesPorServicios_entity_1.ProfesionalesPorServicios, (profesionalesPorServicios) => profesionalesPorServicios.idServicio),
    __metadata("design:type", Array)
], Servicio.prototype, "profesionalesPorServicios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Turnos_entity_1.Turnos, (turnos) => turnos.idServicio),
    __metadata("design:type", Array)
], Servicio.prototype, "turnos", void 0);
exports.Servicio = Servicio = __decorate([
    (0, typeorm_1.Entity)("servicio", { schema: "public" })
], Servicio);
//# sourceMappingURL=Servicio.entity.js.map