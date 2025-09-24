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
exports.ClientesPorServicios = void 0;
const typeorm_1 = require("typeorm");
const Servicio_entity_1 = require("./Servicio.entity");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
let ClientesPorServicios = class ClientesPorServicios {
    id;
    idCliente;
    idServicio;
};
exports.ClientesPorServicios = ClientesPorServicios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity", { name: "id" }),
    __metadata("design:type", Number)
], ClientesPorServicios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, (cliente) => cliente.clientesPorServicios),
    __metadata("design:type", cliente_entity_1.Cliente)
], ClientesPorServicios.prototype, "idCliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Servicio_entity_1.Servicio, (servicio) => servicio.clientesPorServicios),
    (0, typeorm_1.JoinColumn)([{ name: "id_servicio", referencedColumnName: "idServicio" }]),
    __metadata("design:type", Servicio_entity_1.Servicio)
], ClientesPorServicios.prototype, "idServicio", void 0);
exports.ClientesPorServicios = ClientesPorServicios = __decorate([
    (0, typeorm_1.Entity)("clientes_por_servicios", { schema: "public" })
], ClientesPorServicios);
//# sourceMappingURL=ClientesPorServicios.entity.js.map