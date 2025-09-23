import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly service: ProfesionalesService) {}

  /** GET /profesionales */
  @Get()
  findAll(@Query() q: ListProfesionalesQuery) {
    return this.service.findAll(q);
  }

  /** GET /profesionales/:id */
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: number) {
    return this.service.findOne(id);
  }

  /** GET /profesionales/:id/servicios */
  @Get(':id/servicios')
  findServicios(
    @Param('id', new ParseUUIDPipe()) id: number,
  ) {
    return this.service.findServiciosByProfesional(id);
  }
}
