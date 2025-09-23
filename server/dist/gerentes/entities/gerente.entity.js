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
exports.Gerente = void 0;
const Usuario_entity_1 = require("../../entities/entities/Usuario.entity");
const typeorm_1 = require("typeorm");
let Gerente = class Gerente {
    idGerente;
    nombreGerente;
    apellidoGerente;
    telefonoGerente;
    dni;
    fechaAlta;
    fechaUltUpd;
    idUsuario;
};
exports.Gerente = Gerente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity", { name: "id_gerente" }),
    __metadata("design:type", Number)
], Gerente.prototype, "idGerente", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "nombre_gerente", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "nombreGerente", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "apellido_gerente", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "apellidoGerente", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "telefono_gerente", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "telefonoGerente", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "dni", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_alta", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "fechaAlta", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_ult_upd", nullable: true }),
    __metadata("design:type", Object)
], Gerente.prototype, "fechaUltUpd", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_entity_1.Usuario, (usuario) => usuario.gerentes, { eager: true }),
    (0, typeorm_1.JoinColumn)([{ name: "id_usuario", referencedColumnName: "idUsuario" }]),
    __metadata("design:type", Usuario_entity_1.Usuario)
], Gerente.prototype, "idUsuario", void 0);
exports.Gerente = Gerente = __decorate([
    (0, typeorm_1.Entity)("gerente", { schema: "public" })
], Gerente);
//# sourceMappingURL=gerente.entity.js.map