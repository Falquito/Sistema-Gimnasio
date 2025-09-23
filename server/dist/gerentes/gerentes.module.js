"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerentesModule = void 0;
const common_1 = require("@nestjs/common");
const gerentes_service_1 = require("./gerentes.service");
const gerentes_controller_1 = require("./gerentes.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Usuario_entity_1 = require("../entities/entities/Usuario.entity");
const gerente_entity_1 = require("./entities/gerente.entity");
let GerentesModule = class GerentesModule {
};
exports.GerentesModule = GerentesModule;
exports.GerentesModule = GerentesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Usuario_entity_1.Usuario, gerente_entity_1.Gerente])
        ],
        controllers: [gerentes_controller_1.GerentesController],
        providers: [gerentes_service_1.GerentesService],
    })
], GerentesModule);
//# sourceMappingURL=gerentes.module.js.map