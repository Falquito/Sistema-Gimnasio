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
exports.ProfesionalesPorServicios = void 0;
const typeorm_1 = require("typeorm");
const Profesionales_entity_1 = require("./Profesionales.entity");
const Servicio_entity_1 = require("./Servicio.entity");
let ProfesionalesPorServicios = class ProfesionalesPorServicios {
    id;
    idProfesional;
    idServicio;
};
exports.ProfesionalesPorServicios = ProfesionalesPorServicios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], ProfesionalesPorServicios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Profesionales_entity_1.Profesionales, (profesionales) => profesionales.profesionalesPorServicios),
    (0, typeorm_1.JoinColumn)([
        { name: "id_profesional", referencedColumnName: "idProfesionales" },
    ]),
    __metadata("design:type", Profesionales_entity_1.Profesionales)
], ProfesionalesPorServicios.prototype, "idProfesional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Servicio_entity_1.Servicio, (servicio) => servicio.profesionalesPorServicios),
    (0, typeorm_1.JoinColumn)([{ name: "id_servicio", referencedColumnName: "idServicio" }]),
    __metadata("design:type", Servicio_entity_1.Servicio)
], ProfesionalesPorServicios.prototype, "idServicio", void 0);
exports.ProfesionalesPorServicios = ProfesionalesPorServicios = __decorate([
    (0, typeorm_1.Entity)("profesionales_por_servicios", { schema: "public" })
], ProfesionalesPorServicios);
//# sourceMappingURL=ProfesionalesPorServicios.entity.js.map