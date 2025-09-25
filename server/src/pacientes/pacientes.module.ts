import { Module } from '@nestjs/common';
import { PacienteService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';

@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Paciente])
  ],
  controllers: [PacientesController],
  providers: [PacienteService],
})
export class PacientesModule {}
