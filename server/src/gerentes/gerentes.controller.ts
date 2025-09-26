import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GerentesService } from './gerentes.service';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { UpdateGerenteDto } from './dto/update-gerente.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Gerente } from './entities/gerente.entity';
import { validRoles } from 'src/auth/interfaces/validRoles';
@ApiTags("Gerente")
@Controller('gerentes')

export class GerentesController {
  constructor(private readonly gerentesService: GerentesService) {}

  @Post()
  @ApiResponse({status:201,description:"Gerente creado",type:Gerente})
  @ApiResponse({status:401,description:"Unauthorized"})
  @Auth(validRoles.gerente)
  create(@Body() createGerenteDto: CreateGerenteDto) {
    return this.gerentesService.create(createGerenteDto);
  }
  @ApiResponse({status:200,description:"Todos los gerentes",type:Gerente,isArray:true})
  @Auth(validRoles.gerente)
  @Get('')
  findAll() {
    return this.gerentesService.findAll();
  }
  @Auth(validRoles.gerente)
  @Get(':id')
  @ApiOkResponse({description:"Gerente por id",type:Gerente})
  findOne(@Param('id') id: string) {
    return this.gerentesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGerenteDto: UpdateGerenteDto) {
  //   return this.gerentesService.update(+id, updateGerenteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gerentesService.remove(+id);
  // }
}
