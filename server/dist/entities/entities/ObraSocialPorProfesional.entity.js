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
exports.ObraSocialPorProfesional = void 0;
const typeorm_1 = require("typeorm");
const ObraSocial_entity_1 = require("./ObraSocial.entity");
const Profesionales_entity_1 = require("./Profesionales.entity");
let ObraSocialPorProfesional = class ObraSocialPorProfesional {
    id_opp;
    obraSocial;
    profesional;
};
exports.ObraSocialPorProfesional = ObraSocialPorProfesional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], ObraSocialPorProfesional.prototype, "id_opp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ObraSocial_entity_1.ObraSocial, (obraSocial) => obraSocial.obraSocialPorProfesional),
    __metadata("design:type", ObraSocial_entity_1.ObraSocial)
], ObraSocialPorProfesional.prototype, "obraSocial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Profesionales_entity_1.Profesionales, (profesional) => profesional.obraSocialPorProfesional),
    __metadata("design:type", Profesionales_entity_1.Profesionales)
], ObraSocialPorProfesional.prototype, "profesional", void 0);
exports.ObraSocialPorProfesional = ObraSocialPorProfesional = __decorate([
    (0, typeorm_1.Entity)()
], ObraSocialPorProfesional);
//# sourceMappingURL=ObraSocialPorProfesional.entity.js.map