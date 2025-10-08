import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Diagnostico } from "src/entities/entities/Diagnostico.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
import { Profesionales } from "src/entities/entities/Profesionales.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { HistoriaService } from "./historia.service";
import { HistoriaController } from "./historia.controller";
import { AnotacionClinica } from "src/entities/entities/AnotacionClinica.entity";
import { Medicacion } from "src/entities/entities/Medicacion.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([Diagnostico,AnotacionClinica,Turnos, Profesionales, Paciente, Medicacion])],
  providers: [HistoriaService],
  controllers: [HistoriaController],
})
export class HistoriaModule {}
