import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

// ⚠️ Ajusta rutas si tu path difiere
import { Turnos } from 'src/entities/entities/Turnos.entity';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turnos, Servicio, Profesionales, ProfesionalesPorServicios]),
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}
