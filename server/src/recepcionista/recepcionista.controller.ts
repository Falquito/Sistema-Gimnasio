import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecepcionistaService } from './recepcionista.service';
import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto';
import { UpdateRecepcionistaDto } from './dto/update-recepcionista.dto';

@Controller('recepcionista')
export class RecepcionistaController {
  constructor(private readonly recepcionistaService: RecepcionistaService) {}

  @Post()
  create(@Body() createRecepcionistaDto: CreateRecepcionistaDto) {
    return this.recepcionistaService.create(createRecepcionistaDto);
  }

  @Get()
  findAll() {
    return this.recepcionistaService.findAll();
  }

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
