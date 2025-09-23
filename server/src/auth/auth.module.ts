import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Gerente } from 'src/gerentes/entities/gerente.entity';

@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({defaultStrategy:"jwt"}),
    //ASync me asegura que esto espere a que se cargue la variable de entorno
    JwtModule.registerAsync({
      imports:[ConfigModule],//El servicio Config module existe y por eso puedo injectar el servicio cofig
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        // console.log(configService.get("JWT_SECRET_KEY"))
        return {
          secret:configService.get("JWT_SECRET_KEY"),
          signOptions:{
            expiresIn:"2h"
          }
        }
      }
    })

    // JwtModule.register({
    //   //el problema al hacer esto es que no se defina apenas se monte la aplicacion
    //   secret:process.env.JWT_SECRET_KEY,
    //   signOptions:{
    //     expiresIn:"2h"
    //   }
    // }),

  ],
  controllers: [AuthController],
  providers: [AuthService ,JwtStrategy],
  exports:[AuthService,JwtStrategy,PassportModule,JwtModule]
})
export class AuthModule {}
