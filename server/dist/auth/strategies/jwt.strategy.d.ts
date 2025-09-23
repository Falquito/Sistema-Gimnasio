import { Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Usuario } from "src/entities/entities/Usuario.entity";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<Usuario>;
}
export {};
