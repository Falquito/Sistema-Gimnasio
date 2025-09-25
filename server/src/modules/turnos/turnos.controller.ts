// src/modules/turnos/turnos.controller.ts
import {
  Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ReprogramarTurnoDto } from './dto/reprogramar-turno.dto';
import { CancelarTurnoDto } from './dto/cancelar-turno.dto';
import { DisponibilidadQuery } from './dto/disponibilidad.query';
import { AgendaQuery } from './dto/agenda.query';
import { ApiOkResponse } from '@nestjs/swagger';
import { Turnos } from 'src/entities/entities/Turnos.entity';
import { validRoles } from 'src/auth/interfaces/validRoles';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('turnos')
@Auth(validRoles.gerente,validRoles.recepcionista)
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  // HU-4: disponibilidad
  @Get('disponibles')
  getDisponibles(@Query() q: DisponibilidadQuery) {
    return this.turnosService.disponibilidad(q);
  }

  // HU-5: crear (registrar turno)
  @Post()
  @ApiOkResponse({description:"Devuelve turno creado",type:Turnos})
  crear(@Body() dto: CrearTurnoDto) {
    return this.turnosService.crear(dto);
  }

  // HU-6a: cancelar
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelarTurnoDto) {
    return this.turnosService.cancelar(id, dto);
  }


  // Agenda (calendario)
  @Get('agenda')
  agenda(@Query() q: AgendaQuery) {
    return this.turnosService.agenda(q);
  }


  // Utilidades de lectura
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.getById(id);
  }

  @Get()
  @ApiOkResponse({type:Turnos,isArray:true})
  listar(@Query('pacienteId') pacienteId?: string, @Query('estado') estado?: string) {
    return this.turnosService.listar({
      pacienteId: pacienteId ? Number(pacienteId) : undefined,
      estado: estado || undefined,
    });
  }
}
