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
exports.Turnos = void 0;
const typeorm_1 = require("typeorm");
const Profesionales_entity_1 = require("./Profesionales.entity");
const Recepcionista_entity_1 = require("./Recepcionista.entity");
const Servicio_entity_1 = require("./Servicio.entity");
let Turnos = class Turnos {
    idTurno;
    fecha;
    horaInicio;
    horaFin;
    idCliente;
    rutina;
    observacion;
    estado;
    fechaAlta;
    fechaUltUpd;
    idProfesional;
    idRecepcionista;
    idServicio;
};
exports.Turnos = Turnos;
__decorate([
    (0, typeorm_1.Column)("integer", { primary: true, name: "id_turno" }),
    __metadata("design:type", Number)
], Turnos.prototype, "idTurno", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "hora_inicio", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "horaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "hora_fin", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "horaFin", void 0);
__decorate([
    (0, typeorm_1.Column)("integer", { name: "id_cliente", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "idCliente", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "rutina", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "rutina", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "observacion", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "observacion", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "estado", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_alta", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "fechaAlta", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_ult_upd", nullable: true }),
    __metadata("design:type", Object)
], Turnos.prototype, "fechaUltUpd", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Profesionales_entity_1.Profesionales, (profesionales) => profesionales.turnos),
    (0, typeorm_1.JoinColumn)([
        { name: "id_profesional", referencedColumnName: "idProfesionales" },
    ]),
    __metadata("design:type", Profesionales_entity_1.Profesionales)
], Turnos.prototype, "idProfesional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Recepcionista_entity_1.Recepcionista, (recepcionista) => recepcionista.turnos),
    (0, typeorm_1.JoinColumn)([
        { name: "id_recepcionista", referencedColumnName: "idRecepcionista" },
    ]),
    __metadata("design:type", Recepcionista_entity_1.Recepcionista)
], Turnos.prototype, "idRecepcionista", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Servicio_entity_1.Servicio, (servicio) => servicio.turnos),
    (0, typeorm_1.JoinColumn)([{ name: "id_servicio", referencedColumnName: "idServicio" }]),
    __metadata("design:type", Servicio_entity_1.Servicio)
], Turnos.prototype, "idServicio", void 0);
exports.Turnos = Turnos = __decorate([
    (0, typeorm_1.Entity)("turnos", { schema: "public" })
], Turnos);
//# sourceMappingURL=Turnos.entity.js.map