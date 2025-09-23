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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const raw_header_decorator_1 = require("../decorators/raw-header.decorator");
const user_role_guard_1 = require("./guards/user-role/user-role.guard");
const role_protected_decorator_1 = require("./decorators/role-protected.decorator");
const validRoles_1 = require("./interfaces/validRoles");
const auth_decorator_1 = require("./decorators/auth.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(dto) {
        return this.authService.login(dto);
    }
    refresh(token) {
        return this.authService.refresh(token);
    }
    testingPrivateRoute(request, user, userEmail, RawHeaders) {
        console.log(request);
        return {
            ok: true,
            user: user,
            userEmail,
            RawHeaders
        };
    }
    privateRoute2(user) {
        return {
            ok: true,
            user
        };
    }
    privateRoute3(user) {
        return {
            ok: true,
            user
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)("private"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, get_user_decorator_1.GetUser)("idGerente")),
    __param(3, (0, raw_header_decorator_1.RawHeaders)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Array]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testingPrivateRoute", null);
__decorate([
    (0, common_1.Get)("private2"),
    (0, role_protected_decorator_1.RoleProtected)(validRoles_1.validRoles.gerente, validRoles_1.validRoles.recepcionista),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), user_role_guard_1.UserRoleGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "privateRoute2", null);
__decorate([
    (0, common_1.Get)("private3"),
    (0, auth_decorator_1.Auth)(validRoles_1.validRoles.recepcionista, validRoles_1.validRoles.trainer),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "privateRoute3", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map