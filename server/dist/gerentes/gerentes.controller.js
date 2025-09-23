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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerentesController = void 0;
const common_1 = require("@nestjs/common");
const gerentes_service_1 = require("./gerentes.service");
const create_gerente_dto_1 = require("./dto/create-gerente.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const swagger_1 = require("@nestjs/swagger");
const gerente_entity_1 = require("./entities/gerente.entity");
const validRoles_1 = require("../auth/interfaces/validRoles");
let GerentesController = class GerentesController {
    gerentesService;
    constructor(gerentesService) {
        this.gerentesService = gerentesService;
    }
    create(createGerenteDto) {
        return this.gerentesService.create(createGerenteDto);
    }
    findAll() {
        return this.gerentesService.findAll();
    }
    findOne(id) {
        return this.gerentesService.findOne(+id);
    }
};
exports.GerentesController = GerentesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Gerente creado", type: gerente_entity_1.Gerente }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gerente_dto_1.CreateGerenteDto]),
    __metadata("design:returntype", void 0)
], GerentesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: "Todos los gerentes", type: gerente_entity_1.Gerente, isArray: true }),
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GerentesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: "Gerente por id", type: gerente_entity_1.Gerente }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GerentesController.prototype, "findOne", null);
exports.GerentesController = GerentesController = __decorate([
    (0, swagger_1.ApiTags)("Gerente"),
    (0, common_1.Controller)('gerentes'),
    (0, auth_decorator_1.Auth)(validRoles_1.validRoles.gerente),
    __metadata("design:paramtypes", [gerentes_service_1.GerentesService])
], GerentesController);
//# sourceMappingURL=gerentes.controller.js.map