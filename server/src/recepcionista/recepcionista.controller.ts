import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecepcionistaService } from './recepcionista.service';
import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto';
import { UpdateRecepcionistaDto } from './dto/update-recepcionista.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/validRoles';
@Controller('recepcionista')
export class RecepcionistaController {
  constructor(private readonly recepcionistaService: RecepcionistaService) {}
  @Auth(validRoles.recepcionista,validRoles.gerente)

  @Post()
  create(@Body() createRecepcionistaDto: CreateRecepcionistaDto) {
    return this.recepcionistaService.create(createRecepcionistaDto);
  }
  @Auth(validRoles.recepcionista,validRoles.gerente)

  @Get()
  findAll() {
    return this.recepcionistaService.findAll();
  }
  @Auth(validRoles.recepcionista,validRoles.gerente)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recepcionistaService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecepcionistaDto: UpdateRecepcionistaDto) {
  //   return this.recepcionistaService.update(+id, updateRecepcionistaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recepcionistaService.remove(+id);
  // }
}
