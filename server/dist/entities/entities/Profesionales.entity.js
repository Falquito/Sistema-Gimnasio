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
exports.Profesionales = void 0;
const typeorm_1 = require("typeorm");
const Usuario_entity_1 = require("./Usuario.entity");
const Turnos_entity_1 = require("./Turnos.entity");
const ObraSocialPorProfesional_entity_1 = require("./ObraSocialPorProfesional.entity");
let Profesionales = class Profesionales {
    idProfesionales;
    nombreProfesional;
    apellidoProfesional;
    email;
    telefono;
    dni;
    genero;
    fechaAlta;
    fechaUltUpd;
    idUsuario;
    servicio;
    turnos;
    obraSocialPorProfesional;
};
exports.Profesionales = Profesionales;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity", { name: "id_profesionales" }),
    __metadata("design:type", Number)
], Profesionales.prototype, "idProfesionales", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "nombre_profesional", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "nombreProfesional", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "apellido_profesional", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "apellidoProfesional", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "email", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "telefono", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "dni", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "genero", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "genero", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_alta", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "fechaAlta", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_ult_upd", nullable: true }),
    __metadata("design:type", Object)
], Profesionales.prototype, "fechaUltUpd", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_entity_1.Usuario, (usuario) => usuario.profesionales),
    (0, typeorm_1.JoinColumn)([{ name: "id_usuario", referencedColumnName: "idUsuario" }]),
    __metadata("design:type", Usuario_entity_1.Usuario)
], Profesionales.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Profesionales.prototype, "servicio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Turnos_entity_1.Turnos, (turnos) => turnos.idProfesional),
    __metadata("design:type", Array)
], Profesionales.prototype, "turnos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ObraSocialPorProfesional_entity_1.ObraSocialPorProfesional, (obrp) => obrp.profesional),
    __metadata("design:type", ObraSocialPorProfesional_entity_1.ObraSocialPorProfesional)
], Profesionales.prototype, "obraSocialPorProfesional", void 0);
exports.Profesionales = Profesionales = __decorate([
    (0, typeorm_1.Entity)("profesionales", { schema: "public" })
], Profesionales);
//# sourceMappingURL=Profesionales.entity.js.map