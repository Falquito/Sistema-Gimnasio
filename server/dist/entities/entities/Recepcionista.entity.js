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
exports.Recepcionista = void 0;
const typeorm_1 = require("typeorm");
const Usuario_entity_1 = require("./Usuario.entity");
const Turnos_entity_1 = require("./Turnos.entity");
let Recepcionista = class Recepcionista {
    idRecepcionista;
    nombreRecepcionista;
    apellidoRecepcionista;
    telefonoRecepcionista;
    dni;
    fechaAlta;
    fechaUltUpd;
    idUsuario;
    turnos;
};
exports.Recepcionista = Recepcionista;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity", { name: "id_recepcionista" }),
    __metadata("design:type", Number)
], Recepcionista.prototype, "idRecepcionista", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "nombre_recepcionista", nullable: true }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "nombreRecepcionista", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "apellido_recepcionista",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "apellidoRecepcionista", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "telefono_recepcionista",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "telefonoRecepcionista", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "dni", nullable: true }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_alta", nullable: true }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "fechaAlta", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fecha_ult_upd", nullable: true }),
    __metadata("design:type", Object)
], Recepcionista.prototype, "fechaUltUpd", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_entity_1.Usuario, (usuario) => usuario.recepcionistas),
    (0, typeorm_1.JoinColumn)([{ name: "id_usuario", referencedColumnName: "idUsuario" }]),
    __metadata("design:type", Usuario_entity_1.Usuario)
], Recepcionista.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Turnos_entity_1.Turnos, (turnos) => turnos.idRecepcionista),
    __metadata("design:type", Array)
], Recepcionista.prototype, "turnos", void 0);
exports.Recepcionista = Recepcionista = __decorate([
    (0, typeorm_1.Entity)("recepcionista", { schema: "public" })
], Recepcionista);
//# sourceMappingURL=Recepcionista.entity.js.map