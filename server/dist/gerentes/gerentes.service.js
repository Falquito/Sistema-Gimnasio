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
exports.GerentesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const Usuario_entity_1 = require("../entities/entities/Usuario.entity");
const gerente_entity_1 = require("./entities/gerente.entity");
const bcrypt = __importStar(require("bcrypt"));
let GerentesService = class GerentesService {
    dataSource;
    usuarioRepository;
    gerenteRepository;
    constructor(dataSource, usuarioRepository, gerenteRepository) {
        this.dataSource = dataSource;
        this.usuarioRepository = usuarioRepository;
        this.gerenteRepository = gerenteRepository;
    }
    async create(createGerenteDto) {
        const { apellido, dni, nombre, telefono, email, contraseña } = createGerenteDto;
        const queryRunner = this.dataSource.createQueryRunner();
        const fecha = new Date();
        const contraseñaHasheada = await this.hashPassword(contraseña);
        const year = fecha.getFullYear() % 100;
        const month = fecha.getMonth() + 1;
        const day = fecha.getDate();
        const fechaFormateada = `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const usuario = queryRunner.manager.create(Usuario_entity_1.Usuario, {
                email,
                contraseA: contraseñaHasheada,
                rol: "gerente"
            });
            console.log(usuario);
            await queryRunner.manager.save(usuario);
            const gerente = queryRunner.manager.create(gerente_entity_1.Gerente, {
                idUsuario: usuario,
                nombreGerente: nombre,
                apellidoGerente: apellido,
                dni: dni,
                telefonoGerente: telefono,
                fechaAlta: fechaFormateada,
                fechaUltUpd: "-"
            });
            await queryRunner.manager.save(gerente);
            await queryRunner.commitTransaction();
            return gerente;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw new common_1.InternalServerErrorException("Necesito que revise los logs por favor.");
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return await this.gerenteRepository.find();
    }
    async findOne(id) {
        return this.gerenteRepository.findOneBy({ idGerente: id });
    }
    update(id, updateGerenteDto) {
        return `This action updates a #${id} gerente`;
    }
    remove(id) {
        return `This action removes a #${id} gerente`;
    }
    async hashPassword(plainPassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(plainPassword, salt);
        return hashed;
    }
};
exports.GerentesService = GerentesService;
exports.GerentesService = GerentesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectDataSource)()),
    __param(1, (0, typeorm_2.InjectRepository)(Usuario_entity_1.Usuario)),
    __param(2, (0, typeorm_2.InjectRepository)(gerente_entity_1.Gerente)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        typeorm_1.Repository])
], GerentesService);
//# sourceMappingURL=gerentes.service.js.map