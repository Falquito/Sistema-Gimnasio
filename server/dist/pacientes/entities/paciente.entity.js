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
exports.Paciente = void 0;
const ObraSocial_entity_1 = require("../../entities/entities/ObraSocial.entity");
const Turnos_entity_1 = require("../../entities/entities/Turnos.entity");
const typeorm_1 = require("typeorm");
let Paciente = class Paciente {
    id_paciente;
    nombre_paciente;
    apellido_paciente;
    telefono_paciente;
    dni;
    genero;
    fecha_nacimiento;
    observaciones;
    estado;
    email;
    nro_obrasocial;
    turnos;
    obraSocial;
};
exports.Paciente = Paciente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Paciente.prototype, "id_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "nombre_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "apellido_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "telefono_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "genero", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Paciente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true }),
    __metadata("design:type", Boolean)
], Paciente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { default: "", nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], Paciente.prototype, "nro_obrasocial", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Turnos_entity_1.Turnos, (turnos) => turnos.idPaciente),
    __metadata("design:type", Array)
], Paciente.prototype, "turnos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ObraSocial_entity_1.ObraSocial, (obraSocial) => obraSocial.paciente, { eager: true }),
    __metadata("design:type", ObraSocial_entity_1.ObraSocial)
], Paciente.prototype, "obraSocial", void 0);
exports.Paciente = Paciente = __decorate([
    (0, typeorm_1.Entity)()
], Paciente);
//# sourceMappingURL=paciente.entity.js.map