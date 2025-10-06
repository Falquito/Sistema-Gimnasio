import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { HistoriaService } from "./historia.service";
import { CrearDiagnosticoDto } from "./dto/crear-diagnostico.dto";
import { UpdateDiagnosticoDto } from "./dto/update-diagnostico.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { validRoles } from 'src/auth/interfaces/validRoles';
import { CrearAnotacionDto } from "./dto/crear-anotacion.dto";
import { UpdateAnotacionDto } from "./dto/update-anotacion.dto";
import { CrearMedicacionDto } from "./dto/crear-medicacion.dto";
import { UpdateMedicacionDto } from "./dto/update-medicacion.dto";
import { AdministrarMedicacionDto } from "./dto/administrar-medicacion.dto";

@Controller("historia")
export class HistoriaController {
  constructor(private readonly historia: HistoriaService) {}

  @Auth(validRoles.medico, validRoles.gerente)
  @Post("diagnosticos")
  crear(@Body() dto: CrearDiagnosticoDto) {
    return this.historia.crear(dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get("diagnosticos/:id")
  getUno(@Param("id", ParseIntPipe) id: number) {
    return this.historia.getUno(id);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Patch("diagnosticos/:id")
  actualizar(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateDiagnosticoDto) {
    return this.historia.actualizar(id, dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get("pacientes/:pacienteId")
  historial(@Param("pacienteId", ParseIntPipe) pacienteId: number) {
    return this.historia.historialPaciente(pacienteId);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get("turnos/:turnoId/diagnostico")
  porTurno(@Param("turnoId", ParseIntPipe) turnoId: number) {
    return this.historia.porTurno(turnoId);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get('pacientes/:pacienteId/diagnosticos')
  listarDx(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
    @Query('from') from?: string,            // YYYY-MM-DD
    @Query('to') to?: string,                // YYYY-MM-DD
    @Query('profesionalId') profesionalId?: number,
    @Query('servicio') servicio?: string,    // string en Profesionales.servicio
    @Query('q') q?: string                   // texto libre (cie/síntomas/obs)
  ) {
    return this.historia.listarDiagnosticos(pacienteId, { from, to, profesionalId, servicio, q });
  }

    // ---- ANOTACIONES ----

  @Auth(validRoles.medico, validRoles.gerente)
  @Post("anotaciones")
  crearAnot(@Body() dto: CrearAnotacionDto) {
    return this.historia.crearAnotacion(dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get("anotaciones/:id")
  getAnot(@Param("id", ParseIntPipe) id: number) {
    return this.historia.getAnotacion(id);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Patch("anotaciones/:id")
  updAnot(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAnotacionDto
  ) {
    return this.historia.actualizarAnotacion(id, dto);
  }

  // Timeline con filtros para el paciente
  @Auth(validRoles.medico, validRoles.gerente)
  @Get("pacientes/:pacienteId/anotaciones")
  listAnot(
    @Param("pacienteId", ParseIntPipe) pacienteId: number,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("profesionalId") profesionalId?: number,
    @Query("servicio") servicio?: string,
    @Query("q") q?: string,
  ) {
    return this.historia.listarAnotaciones(pacienteId, { from, to, profesionalId, servicio, q });
  }

  // ---- MEDICACION ----
  @Auth(validRoles.medico, validRoles.gerente)
  @Post("medicaciones")
  crearMed(@Body() dto: CrearMedicacionDto) {
    return this.historia.crearMedicacion(dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Patch("medicaciones/:id")
  updMed(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMedicacionDto) {
    return this.historia.actualizarMedicacion(id, dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Post("medicaciones/:id/administrar")
  adminMed(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AdministrarMedicacionDto
  ) {
    return this.historia.administrarMedicacion(id, dto);
  }

  @Auth(validRoles.medico, validRoles.gerente)
  @Get("pacientes/:pacienteId/medicaciones")
  listMed(
    @Param("pacienteId", ParseIntPipe) pacienteId: number,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("profesionalId") profesionalId?: number,
    @Query("servicio") servicio?: string,
    @Query("q") q?: string,
  ) {
    return this.historia.listarMedicaciones(pacienteId, { from, to, profesionalId, servicio, q });
  }
}
