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

@Controller('turnos')
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

  // HU-6b: reprogramar
  @Patch(':id/reprogramar')
  reprogramar(@Param('id', ParseIntPipe) id: number, @Body() dto: ReprogramarTurnoDto) {
    return this.turnosService.reprogramar(id, dto);
  }

  // Agenda (calendario)
  @Get('agenda')
  agenda(@Query() q: AgendaQuery) {
    return this.turnosService.agenda(q);
  }

  // Utilidades de lectura
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // expón en el service un método público que retorne por id
    return this.turnosService.getById(id);
  }

  @Get()
  @ApiOkResponse({type:Turnos,isArray:true})
  listar(@Query('clienteId') clienteId?: string, @Query('estado') estado?: string) {
    return this.turnosService.listar({
      clienteId: clienteId ? Number(clienteId) : undefined,
      estado: estado || undefined,
    });
  }
}
