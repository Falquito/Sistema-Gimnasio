import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private jwtService;
    private readonly usuarioRepository;
    constructor(jwtService: JwtService, usuarioRepository: Repository<Usuario>);
    login(dto: LoginDto): Promise<{
        token: string;
        idUsuario: number;
        email: string | null;
        rol: string | null;
        contraseA: string | null;
        gerentes: import("../gerentes/entities/gerente.entity").Gerente[];
        profesionales: import("../entities/entities/Profesionales.entity").Profesionales[];
        recepcionistas: import("../entities/entities/Recepcionista.entity").Recepcionista[];
    }>;
    private getJwtToken;
    refresh(token: string): Promise<{
        accessToken: string;
    }>;
    private hashPassword;
}
