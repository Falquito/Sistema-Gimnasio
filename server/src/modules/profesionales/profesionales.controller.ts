import { Body, Controller, Get, Param,ParseIntPipe , ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/validRoles';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly service: ProfesionalesService) {}

  /** GET /profesionales */
  @Auth(validRoles.gerente ,validRoles.medico,validRoles.recepcionista)
  @Get()
  findAll(@Query() q: ListProfesionalesQuery) {
    return this.service.findAll(q);
  }
  @Auth(validRoles.gerente ,validRoles.medico,validRoles.recepcionista)
  /** GET /profesionales/:id */
  @Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}

  /** GET /profesionales/:id/servicios */
  // @Get(':id/servicios')
  // findServicios(
  //   @Param('id', new ParseUUIDPipe()) id: number,
  // ) {
  //   return this.service.findServiciosByProfesional(id);
  // }
  @Auth(validRoles.gerente)
  @Post()
  // @Auth(validRoles.gerente)
  create(@Body() createProfesionalDto:CreateProfesionaleDto){
    return this.service.create(createProfesionalDto);
  }


}
