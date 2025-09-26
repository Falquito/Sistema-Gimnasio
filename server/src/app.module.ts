import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { GerentesModule } from './gerentes/gerentes.module';
import { Usuario } from './entities/entities/Usuario.entity';
import { Profesionales } from './entities/entities/Profesionales.entity';
import { Recepcionista } from './entities/entities/Recepcionista.entity';
import { Turnos } from './entities/entities/Turnos.entity';
// import { Servicio } from './entities/entities/Servicio.entity';
// import { ClientesPorServicios } from './entities/entities/ClientesPorServicios.entity';
// import { ProfesionalesPorServicios } from './entities/entities/ProfesionalesPorServicios.entity';
// import { Gerente } from './gerentes/entities/gerente.entity';
import { TurnosModule } from './modules/turnos/turnos.module';
// import { ServiciosModule } from './modules/servicios/servicios.module';
import { ProfesionalesModule } from './modules/profesionales/profesionales.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { RecepcionistaModule } from './recepcionista/recepcionista.module';
import { ObraSocialModule } from './obra-social/obra-social.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type:"postgres",
        url:process.env.DB_URL,
      ssl:
      {
        rejectUnauthorized:false
      },
      autoLoadEntities:true,
      synchronize:false,
      entities:[
        // __dirname + '/**/entities/*.entity.{ts,js}'
        __dirname + '/**/*.entity{.ts,.js}'
      ]
    }),
    GerentesModule,
    TurnosModule,
    // ServiciosModule,
    ProfesionalesModule,
    PacientesModule,
    RecepcionistaModule,
    ObraSocialModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService,
    
    
  ],
})
export class AppModule {}
