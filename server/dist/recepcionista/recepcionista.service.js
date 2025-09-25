"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecepcionistaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Recepcionista_entity_1 = require("../entities/entities/Recepcionista.entity");
const Usuario_entity_1 = require("../entities/entities/Usuario.entity");
const bcrypt = __importStar(require("bcrypt"));
let RecepcionistaService = class RecepcionistaService {
    dataSource;
    recepcionistaRepository;
    constructor(dataSource, recepcionistaRepository) {
        this.dataSource = dataSource;
        this.recepcionistaRepository = recepcionistaRepository;
    }
    async create(createRecepcionistaDto) {
        const { apellido, dni, fecha_alta, fecha_ult_upd, email, password, nombre, telefono } = createRecepcionistaDto;
        const queryRunner = this.dataSource.createQueryRunner();
        const contraseñaHasheada = await this.hashPassword(password);
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const usuario = queryRunner.manager.create(Usuario_entity_1.Usuario, {
                email: email,
                contraseA: contraseñaHasheada,
                rol: "recepcionista"
            });
            await queryRunner.manager.save(usuario);
            const recepcionista = queryRunner.manager.create(Recepcionista_entity_1.Recepcionista, {
                apellidoRecepcionista: apellido,
                dni: dni,
                fechaAlta: fecha_alta,
                fechaUltUpd: fecha_ult_upd,
                idUsuario: usuario,
                nombreRecepcionista: nombre,
                telefonoRecepcionista: telefono,
            });
            await queryRunner.manager.save(recepcionista);
            await queryRunner.commitTransaction();
            return recepcionista;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return await this.recepcionistaRepository.find();
    }
    async findOne(id) {
        return await this.recepcionistaRepository.findOneBy({ idRecepcionista: id });
    }
    async hashPassword(plainPassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(plainPassword, salt);
        return hashed;
    }
};
exports.RecepcionistaService = RecepcionistaService;
exports.RecepcionistaService = RecepcionistaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(Recepcionista_entity_1.Recepcionista)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], RecepcionistaService);
//# sourceMappingURL=recepcionista.service.js.map