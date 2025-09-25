"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecepcionistaModule = void 0;
const common_1 = require("@nestjs/common");
const recepcionista_service_1 = require("./recepcionista.service");
const recepcionista_controller_1 = require("./recepcionista.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Recepcionista_entity_1 = require("../entities/entities/Recepcionista.entity");
let RecepcionistaModule = class RecepcionistaModule {
};
exports.RecepcionistaModule = RecepcionistaModule;
exports.RecepcionistaModule = RecepcionistaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Recepcionista_entity_1.Recepcionista])],
        controllers: [recepcionista_controller_1.RecepcionistaController],
        providers: [recepcionista_service_1.RecepcionistaService],
    })
], RecepcionistaModule);
//# sourceMappingURL=recepcionista.module.js.map