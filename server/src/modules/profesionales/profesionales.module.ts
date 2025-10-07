import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalesController } from './profesionales.controller';
import { ProfesionalesService } from './profesionales.service';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
// import { Servicio } from 'src/entities/entities/Servicio.entity';
// import { ProfesionalesPorServicios } from 'src/entities/entities/ProfesionalesPorServicios.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([Profesionales]),
  ],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService],
  exports: [ProfesionalesService],
})
export class ProfesionalesModule {}
