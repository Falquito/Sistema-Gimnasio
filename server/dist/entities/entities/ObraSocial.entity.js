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
exports.ObraSocial = void 0;
const typeorm_1 = require("typeorm");
const ObraSocialPorProfesional_entity_1 = require("./ObraSocialPorProfesional.entity");
let ObraSocial = class ObraSocial {
    id_os;
    nombre;
    fecha_alta;
    obraSocialPorProfesional;
};
exports.ObraSocial = ObraSocial;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], ObraSocial.prototype, "id_os", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], ObraSocial.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], ObraSocial.prototype, "fecha_alta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ObraSocialPorProfesional_entity_1.ObraSocialPorProfesional, (obrp) => obrp.obraSocial),
    __metadata("design:type", Array)
], ObraSocial.prototype, "obraSocialPorProfesional", void 0);
exports.ObraSocial = ObraSocial = __decorate([
    (0, typeorm_1.Entity)()
], ObraSocial);
//# sourceMappingURL=ObraSocial.entity.js.map