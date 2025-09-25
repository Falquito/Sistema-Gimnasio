import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacienteService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth()
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  create(@Body() createClienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacienteService.remove(+id);
  }
}
