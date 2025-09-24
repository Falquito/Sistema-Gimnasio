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
exports.Cliente = void 0;
const ClientesPorServicios_entity_1 = require("../../entities/entities/ClientesPorServicios.entity");
const Turnos_entity_1 = require("../../entities/entities/Turnos.entity");
const typeorm_1 = require("typeorm");
let Cliente = class Cliente {
    id_cliente;
    nombre_cliente;
    apellido_cliente;
    telefono_cliente;
    dni;
    genero;
    fecha_alta;
    fecha_ult_upd;
    peso;
    altura;
    fecha_nacimiento;
    nivel_fisico;
    observaciones;
    clientesPorServicios;
    turnos;
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Cliente.prototype, "id_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "nombre_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "apellido_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "telefono_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "genero", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "fecha_alta", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "fecha_ult_upd", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Cliente.prototype, "peso", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Cliente.prototype, "altura", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "nivel_fisico", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Cliente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ClientesPorServicios_entity_1.ClientesPorServicios, (clientesPorServicios) => clientesPorServicios.idServicio, { eager: true }),
    __metadata("design:type", Array)
], Cliente.prototype, "clientesPorServicios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Turnos_entity_1.Turnos, (turnos) => turnos.idCliente),
    __metadata("design:type", Array)
], Cliente.prototype, "turnos", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)()
], Cliente);
//# sourceMappingURL=cliente.entity.js.map