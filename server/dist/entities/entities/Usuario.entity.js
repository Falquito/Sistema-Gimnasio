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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const Profesionales_entity_1 = require("./Profesionales.entity");
const gerente_entity_1 = require("../../gerentes/entities/gerente.entity");
const Recepcionista_entity_1 = require("./Recepcionista.entity");
const swagger_1 = require("@nestjs/swagger");
let Usuario = class Usuario {
    idUsuario;
    email;
    rol;
    contraseA;
    gerentes;
    profesionales;
    recepcionistas;
};
exports.Usuario = Usuario;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)("identity", { name: "id_usuario" }),
    __metadata("design:type", Number)
], Usuario.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "email", nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "rol", nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "contraseña", nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "contraseA", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gerente_entity_1.Gerente, (gerente) => gerente.idUsuario),
    __metadata("design:type", Array)
], Usuario.prototype, "gerentes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Profesionales_entity_1.Profesionales, (profesionales) => profesionales.idUsuario),
    __metadata("design:type", Array)
], Usuario.prototype, "profesionales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Recepcionista_entity_1.Recepcionista, (recepcionista) => recepcionista.idUsuario),
    __metadata("design:type", Array)
], Usuario.prototype, "recepcionistas", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)("usuario", { schema: "public" })
], Usuario);
//# sourceMappingURL=Usuario.entity.js.map