import { Module } from '@nestjs/common';
import { PacienteService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { ObraSocial } from 'src/entities/entities/ObraSocial.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    AuthModule,PassportModule,
    TypeOrmModule.forFeature([Paciente,ObraSocial])
  ],
  controllers: [PacientesController],
  providers: [PacienteService],
})
export class PacientesModule {}
