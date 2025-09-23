import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Gerente } from "src/gerentes/entities/gerente.entity";
import { Usuario } from "src/entities/entities/Usuario.entity";

//Todas las estrategias son providers
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository:Repository<Usuario>,
        configService:ConfigService
    ){
        super({
            secretOrKey: configService.get("JWT_SECRET_KEY")!,
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload:JwtPayload){
        const {id,rol} = payload;

        const user = await this.usuarioRepository.findOneBy({idUsuario:id})
        if (!user){
            throw new UnauthorizedException("Token no valido, el usuario no existe!")
        }
        //que gano returnando esto, se añade a la request !!
        return user;
    }
}