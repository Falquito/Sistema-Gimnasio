import { Body, Controller, Delete, Get, Param,ParseIntPipe , ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { ListProfesionalesQuery } from 'src/modules/profesionales/dto/list-profesionales.query';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/validRoles';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly service: ProfesionalesService) {}

  /** GET /profesionales */
  @Auth()
  @Get()
  findAll(@Query() q: ListProfesionalesQuery) {
    return this.service.findAll(q);
  }
  @Auth()
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

  @Auth(validRoles.gerente)
  @Patch(":id")
  update(@Param("id",ParseIntPipe) id:number,@Body() updateProfesionaleDto:UpdateProfesionaleDto){
    return this.service.update(id,updateProfesionaleDto)
  }

  @Auth(validRoles.gerente)
  @Delete(":id")
  
  softDelete(
    @Param("id",ParseIntPipe) id:number,
    @GetUser() user){
    return this.service.softDelete(id,user)
  }
}
