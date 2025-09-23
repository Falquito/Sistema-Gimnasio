import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(token: string): Promise<{
        accessToken: string;
    }>;
    testingPrivateRoute(request: Express.Request, user: any, userEmail: string, RawHeaders: string[]): {
        ok: boolean;
        user: any;
        userEmail: string;
        RawHeaders: string[];
    };
    privateRoute2(user: any): {
        ok: boolean;
        user: any;
    };
    privateRoute3(user: any): {
        ok: boolean;
        user: any;
    };
}
